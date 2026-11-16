const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const { spawn } = require("node:child_process"),
  fs = require("node:fs"),
  crypto = require("node:crypto"),
  assert = require("node:assert/strict");
const base = "http://127.0.0.1:3021",
  dir = fs.mkdtempSync("/tmp/wed-editor-"),
  password = crypto.randomBytes(24).toString("hex"),
  out = "artifacts/studio-workflow";
fs.mkdirSync(out, { recursive: true });
const server = spawn(
  process.execPath,
  [
    "node_modules/next/dist/bin/next",
    "start",
    "--hostname",
    "127.0.0.1",
    "--port",
    "3021",
  ],
  {
    env: {
      ...process.env,
      WEDINVITE_DATA_DIR: dir,
      WEDINVITE_ADMIN_USERNAME: "qa",
      WEDINVITE_ADMIN_KEY: password,
    },
    stdio: "ignore",
  },
);
let browser, page;
const errors = [];
(async () => {
  try {
    for (let i = 0; i < 80; i++) {
      try {
        if ((await fetch(base + "/api/platform")).ok) break;
      } catch {}
      await new Promise((r) => setTimeout(r, 250));
    }
    browser = await chromium.launch({
      executablePath: "/usr/bin/chromium",
      args: ["--no-sandbox"],
    });
    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
      reducedMotion: "reduce",
      permissions: ["clipboard-read", "clipboard-write"],
    });
    page = await ctx.newPage();
    page.setDefaultTimeout(15000);
    page.on("pageerror", (e) => errors.push(e.message));
    const headers = async () => ({
        Origin: base,
        Cookie: (await ctx.cookies())
          .map((c) => c.name + "=" + c.value)
          .join("; "),
      }),
      post = async (body) =>
        ctx.request.post(base + "/api/platform", {
          headers: await headers(),
          data: body,
        });
    const state = async () =>
      await (
        await ctx.request.get(base + "/api/platform", {
          headers: await headers(),
        })
      ).json();
    assert.equal(
      (
        await post({ action: "admin-login", username: "qa", password })
      ).status(),
      200,
    );
    const details = {
      groom: "QA Studio Groom",
      bride: "QA Studio Bride",
      phone: "03001234567",
      events: ["Mehndi", "Barat", "Walima"].map((name, i) => ({
        id: "event-" + i,
        name,
        date: "2028-05-" + (20 + i),
        time: "19:00",
        venue: "QA " + name + " Hall",
        address: "Karachi",
      })),
    };
    const { id } = await (
      await post({
        action: "save",
        suiteVersion: 2,
        template: "baradari",
        tier: "full",
        slug: "qa-studio-suite",
        addons: [],
        details,
      })
    ).json();
    await page.goto(base + "/admin/create?order=" + id);
    await page
      .getByRole("button", { name: "3. Events & venues", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Move Mehndi down", exact: true })
      .click();
    assert.equal(
      await page
        .locator(".event-form")
        .first()
        .getByLabel("Event name", { exact: true })
        .inputValue(),
      "Barat",
    );
    const event = page.locator(".event-form").nth(1);
    await event.locator("summary").click();
    await event
      .getByLabel("Event invitation message", { exact: true })
      .fill("Our editable mehndi evening");
    await event
      .getByLabel("Dress code", { exact: true })
      .fill("Yellow and gold");
    await event
      .getByLabel("Exact Google Maps / venue link")
      .fill("https://www.google.com/maps/search/?api=1&query=QA-Mehndi");
    await event
      .getByRole("button", { name: "+ Add schedule item", exact: true })
      .click();
    await event.getByLabel("Activity", { exact: true }).fill("Family dinner");
    await page
      .getByRole("button", { name: "4. Review & save", exact: true })
      .click();
    await page
      .getByLabel("Main date reveal & countdown")
      .selectOption("event-1");
    await page.getByLabel("Enable invitation music").uncheck();
    await page.getByLabel("Text size").selectOption("large");
    await page
      .getByText("Family wording & guest information", { exact: true })
      .click();
    await page
      .getByLabel("Welcome message", { exact: true })
      .fill("A welcome written in the studio");
    await page
      .getByLabel("Invitation version", { exact: true })
      .selectOption("event-0");
    await page
      .getByRole("button", { name: "Preview these details", exact: true })
      .click();
    const modal = page.getByRole("dialog", {
      name: "Personalized invitation preview",
    });
    await modal.waitFor();
    const card = modal.frameLocator("iframe").frameLocator("iframe");
    await card.locator("#eventPath>.evCard").waitFor();
    assert.equal(await card.locator("#eventPath>.evCard").count(), 1);
    assert(
      (await card.locator("#eventPath").textContent()).includes(
        "Our editable mehndi evening",
      ),
    );
    assert.equal(
      (await state()).orders[0].details.events[0].name,
      "Mehndi",
      "Unsaved preview must not write to order",
    );
    await card.locator("#studioRsvp").evaluate((el) => el.click());
    await modal
      .getByText("Guest replies are connected.", { exact: true })
      .waitFor();
    await modal
      .getByRole("button", { name: "Back to preview", exact: true })
      .click();
    await modal.getByRole("button", { name: "Desktop", exact: true }).click();
    assert((await modal.locator("iframe").boundingBox()).width > 1000);
    await modal
      .getByRole("button", { name: "Close preview", exact: true })
      .click();
    await page.screenshot({
      path: out + "/editor-desktop.png",
      fullPage: true,
    });
    await page.getByLabel('I’ve checked the names, dates and venues.').check();
    await page
      .getByRole("button", { name: "Save invitation changes ↗", exact: true })
      .click();
    await page.waitForURL(base + "/admin");
    let order = (await state()).orders[0];
    assert.equal(order.details.events[0].id, "event-1");
    assert.equal(
      order.details.events[1].description,
      "Our editable mehndi evening",
    );
    assert.equal(order.details.templateOptions.baradari.music, false);
    assert.equal(order.contentRevision, 2);
    await page.goto(base + "/admin?order=" + id);
    await page
      .getByRole("heading", { name: "Invitation delivery suite", exact: true })
      .waitFor();
    assert.equal(await page.locator(".suite-version").count(), 4);
    await page
      .getByRole("button", { name: "Verify payment & activate", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Copy full delivery message", exact: true })
      .waitFor();
    for (const name of [
      "Preview complete",
      "Preview Barat only",
      "Preview Mehndi only",
      "Preview Walima only",
    ]) {
      await page.getByRole("button", { name, exact: true }).click();
      const dialog = page.getByRole("dialog", {
        name: "Review invitation version",
      });
      await dialog
        .getByRole("button", {
          name: "Mark this version reviewed",
          exact: true,
        })
        .click();
      await dialog
        .getByRole("button", { name: "Reviewed ✓", exact: true })
        .waitFor();
      await dialog
        .getByRole("button", { name: "Close preview", exact: true })
        .click();
    }
    await page.getByText("4/4 reviewed", { exact: true }).waitFor();
    await page
      .getByRole("button", { name: "Copy full delivery message", exact: true })
      .click();
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    assert.equal((copied.match(/http:\/\//g) || []).length, 4);
    assert(copied.includes("/invite/qa-studio-suite/mehndi"));
    assert(!copied.includes("?event="));
    await page.getByLabel("Update fulfillment status").selectOption("ready");
    await page
      .getByRole("button", { name: "Save fulfillment", exact: true })
      .click();
    await page.getByRole("status").waitFor();
    for (const width of [1440, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      );
      if (width === 390)
        await page.screenshot({
          path: out + "/delivery-mobile.png",
          fullPage: true,
        });
    }
    const guest = await browser.newContext({
        viewport: { width: 390, height: 844 },
      }),
      gp = await guest.newPage();
    await gp.goto(base + "/invite/qa-studio-suite?event=event-0");
    await gp
      .getByRole("button", { name: "Reply with love ♡", exact: true })
      .click();
    assert.equal(await gp.locator("input[name=eventIds]").count(), 1);
    await gp.getByLabel("Your name").fill("QA Event Guest");
    await gp
      .getByRole("button", { name: "Send my reply ♡", exact: true })
      .click();
    await gp
      .getByText("Thank you. Your reply has reached the couple.", {
        exact: true,
      })
      .waitFor();
    assert.equal((await state()).rsvps[0].responses[0].eventId, "event-0");
    assert.deepEqual(errors, []);
    console.log(
      "PASS: event-aware editing, reorder, unsaved scoped preview, preview RSVP feedback, desktop/mobile previews, save, four-version review, delivery message, fulfillment, mobile layouts and guest RSVP",
    );
  } finally {
    if (page)
      await page
        .screenshot({ path: out + "/last-state.png", fullPage: true })
        .catch(() => {});
    if (browser) await browser.close();
    server.kill();
    fs.rmSync(dir, { recursive: true, force: true });
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
