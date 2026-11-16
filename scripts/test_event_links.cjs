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
    // Configure independent addresses in the actual admin UI.
    await admin.grantPermissions(["clipboard-read", "clipboard-write"]);
    const ap = await admin.newPage();
    await ap.goto(base + "/admin?order=" + id);
    await ap.getByText("Link settings", { exact: true }).click();
    await ap.getByLabel(/^Walima address/).fill("sara-reception");
    await ap.getByLabel(/^Barat address/).fill("sara-ceremony");
    await ap.getByLabel(/^Mehndi address/).fill("sara-mehndi");
    await ap
      .getByLabel("Allow guests to open the complete invitation")
      .uncheck();
    await ap
      .getByRole("button", { name: "Save link settings", exact: true })
      .click();
    await ap.getByText("/event/sara-mehndi", { exact: true }).waitFor();
    assert.equal(
      await ap
        .getByRole("button", { name: "Copy live link", exact: true })
        .count(),
      0,
    );
    await ap
      .getByRole("button", { name: "Copy full delivery message", exact: true })
      .click();
    const copied = await ap.evaluate(() => navigator.clipboard.readText());
    assert(copied.includes("/event/sara-mehndi"));
    assert(!copied.includes("/invite/qa-couple"));
    for (const target of ["qa-couple", id]) {
      for (const query of ["", "?format=meta", "?preview=1"])
        assert.equal(
          (
            await guest.request.get(base + "/api/invitation/" + target + query)
          ).status(),
          404,
        );
    }
    assert.equal(
      (
        await guest.request.post(base + "/api/platform", {
          headers: { Origin: base },
          data: {
            action: "rsvp",
            id,
            name: "Bypass",
            count: 1,
            attending: true,
          },
        })
      ).status(),
      404,
    );
    assert.equal(
      (
        await guest.request.post(base + "/api/platform", {
          headers: { Origin: base },
          data: { action: "configure-links", id },
        })
      ).status(),
      403,
    );
    await page.goto(base + "/event/sara-mehndi");
    await page
      .getByRole("button", { name: "Reply with love ♡", exact: true })
      .click();
    await page
      .getByLabel("Your name", { exact: true })
      .fill("Independent guest");
    await page
      .getByRole("button", { name: "Send my reply ♡", exact: true })
      .click();
    await page
      .getByText("Thank you. Your reply has reached the couple.", {
        exact: true,
      })
      .waitFor();
    const meta = await (
      await guest.request.get(
        base + "/api/invitation/event%3Asara-mehndi?format=meta",
      )
    ).json();
    assert.deepEqual(
      meta.events.map((e) => e.id),
      ["new-mehndi"],
    );
    assert.equal(
      (
        await guest.request.get(
          base + "/api/invitation/event%3Asara-mehndi?event=stable-1",
        )
      ).status(),
      403,
    );
    await page.goto(base + "/event");
    assert.equal(await page.locator("iframe").count(), 0);
    const headers = {
      Origin: base,
      Cookie: (await admin.cookies())
        .map((c) => c.name + "=" + c.value)
        .join("; "),
    };
    assert.equal(
      (
        await admin.request.get(base + "/api/invitation/" + id, { headers })
      ).status(),
      200,
      "studio still previews full invitation",
    );
    const links = {
      "stable-2": "sara-reception",
      "stable-1": "sara-ceremony",
      "new-mehndi": "sara-henna",
    };
    assert.equal(
      (
        await admin.request.post(base + "/api/platform", {
          headers,
          data: {
            action: "configure-links",
            id,
            linkRevision: 0,
            eventLinks: links,
            combinedPublic: false,
          },
        })
      ).status(),
      409,
    );
    await post({
      action: "configure-links",
      id,
      linkRevision: 1,
      eventLinks: links,
      combinedPublic: false,
    });
    assert.equal(
      (
        await guest.request.get(base + "/api/invitation/event%3Asara-mehndi")
      ).status(),
      403,
    );
    assert.equal(
      (
        await guest.request.get(base + "/api/invitation/event%3Asara-henna")
      ).status(),
      200,
    );
    assert.equal(
      (
        await admin.request.post(base + "/api/platform", {
          headers,
          data: {
            action: "configure-links",
            id: duplicate.id,
            linkRevision: 0,
            eventLinks: {
              "dup-0": "sara-henna",
              "dup-1": "unused-a",
              "dup-2": "unused-b",
            },
            combinedPublic: false,
          },
        })
      ).status(),
      400,
    );
    await post({
      action: "configure-links",
      id,
      linkRevision: 2,
      eventLinks: links,
      combinedPublic: true,
    });
    assert.equal(
      (await guest.request.get(base + "/api/invitation/" + id)).status(),
      200,
    );
    db = JSON.parse(fs.readFileSync(dir + "/platform.json"));
    assert.equal(db.rsvps.at(-1).eventId, "new-mehndi");
    console.log(
      "PASS editable independent links, copied delivery URLs, stripped parent, disabled full API/meta/RSVP, alias scope enforcement, studio access, conflicts, address changes and visibility restore",
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
