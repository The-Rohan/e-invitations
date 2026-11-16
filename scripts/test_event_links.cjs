const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const { spawn } = require("node:child_process");
const fs = require("node:fs"),
  assert = require("node:assert/strict"),
  crypto = require("node:crypto");
const base = "http://127.0.0.1:3053",
  dir = fs.mkdtempSync("/tmp/wed-links-"),
  password = crypto.randomBytes(24).toString("hex");
const server = spawn(
  process.execPath,
  [
    "node_modules/next/dist/bin/next",
    "start",
    "--port",
    "3053",
    "--hostname",
    "127.0.0.1",
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
let browser;
(async () => {
  try {
    for (let i = 0; i < 100; i++) {
      try {
        if ((await fetch(base + "/api/platform")).ok) break;
      } catch {}
      await new Promise((r) => setTimeout(r, 100));
    }
    browser = await chromium.launch({
      executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
      args: ["--no-sandbox"],
    });
    const admin = await browser.newContext(),
      guest = await browser.newContext();
    const post = async (body) => {
      const r = await admin.request.post(base + "/api/platform", {
        headers: {
          Origin: base,
          Cookie: (await admin.cookies())
            .map((c) => c.name + "=" + c.value)
            .join("; "),
        },
        data: body,
      });
      assert.equal(r.status(), 200, await r.text());
      return r.json();
    };
    await post({ action: "admin-login", username: "qa", password });
    const details = {
      groom: "QA Groom",
      bride: "QA Bride",
      phone: "03001234567",
      events: ["Mehndi", "Barat", "Walima"].map((name, i) => ({
        id: "stable-" + i,
        name,
        date: "2028-06-" + (20 + i),
        time: "19:00",
        venue: "QA Garden",
        address: "Karachi",
      })),
    };
    const body = {
      action: "save",
      template: "baradari",
      tier: "full",
      addons: [],
      slug: "qa-couple",
      details,
    };
    const { id } = await post(body);
    body.id = id;
    const page = await guest.newPage();
    await page.goto(base + "/invite/qa-couple/mehndi");
    assert.equal(
      await page.locator("iframe").count(),
      0,
      "private route must not expose invitation",
    );
    await post({ action: "approve", id });
    for (const [i, slug] of ["mehndi", "barat", "walima"].entries()) {
      await page.goto(base + "/invite/qa-couple/" + slug);
      await page.locator("iframe").waitFor();
      assert(
        (await page.locator("iframe").getAttribute("src")).includes(
          "event=stable-" + i,
        ),
      );
      await page
        .getByRole("button", { name: "Reply with love ♡", exact: true })
        .click();
      await page.getByLabel("Your name", { exact: true }).fill("QA " + slug);
      await page
        .getByRole("button", { name: "Send my reply ♡", exact: true })
        .click();
      await page
        .getByText("Thank you. Your reply has reached the couple.", {
          exact: true,
        })
        .waitFor();
    }
    let db = JSON.parse(fs.readFileSync(dir + "/platform.json"));
    assert.deepEqual(
      db.rsvps.map((r) => r.eventId),
      ["stable-0", "stable-1", "stable-2"],
    );
    body.details.events.reverse();
    body.details.events[2].name = "Mehndi Night";
    await post(body);
    await page.goto(base + "/invite/qa-couple/mehndi");
    await page.locator("iframe").waitFor();
    assert(
      (await page.locator("iframe").getAttribute("src")).includes(
        "event=stable-0",
      ),
    );
    await page.goto(base + "/invite/qa-couple?event=stable-0");
    await page.locator("iframe").waitFor();
    assert(
      (await page.locator("iframe").getAttribute("src")).includes(
        "event=stable-0",
      ),
    );
    body.details.events = body.details.events.filter(
      (e) => e.id !== "stable-0",
    );
    await post(body);
    body.details.events.push({
      id: "new-mehndi",
      name: "Mehndi",
      date: "2028-06-25",
      time: "19:00",
      venue: "QA Garden",
      address: "Karachi",
    });
    await post(body);
    await page.goto(base + "/invite/qa-couple/mehndi");
    assert.equal(
      await page.locator("iframe").count(),
      0,
      "retired link must not point to replacement event",
    );
    await page.goto(base + "/invite/qa-couple/mehndi-2");
    await page.locator("iframe").waitFor();
    assert(
      (await page.locator("iframe").getAttribute("src")).includes(
        "event=new-mehndi",
      ),
    );
    body.slug = "duplicate-events";
    delete body.id;
    body.details.events = body.details.events.map((e, i) => ({
      ...e,
      id: "dup-" + i,
      name: "Mehndi",
      publicSlug: "forged",
    }));
    await post(body);
    db = JSON.parse(fs.readFileSync(dir + "/platform.json"));
    const duplicate = db.orders.find((o) => o.slug === "duplicate-events");
    assert.deepEqual(
      duplicate.details.events.map((e) => e.publicSlug),
      ["mehndi", "mehndi-2", "mehndi-3"],
    );
    console.log(
      "PASS clean event routes, private access, scoped RSVP, legacy URLs, rename/reorder stability, removed-link protection, duplicate names and server-controlled slugs",
    );
  } finally {
    await browser?.close();
    server.kill();
    fs.rmSync(dir, { recursive: true, force: true });
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
