const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
const path = require("node:path");
const base = "http://127.0.0.1:3002";
const dataDir = fs.mkdtempSync("/tmp/wed-dashboard-");
const password = crypto.randomBytes(32).toString("hex");
const results = [];
const errors = [];
const out = "artifacts/dashboard-tests";
fs.mkdirSync(out, { recursive: true });
let server, browser, page, admin, guest;
const delay = (ms) => new Promise((r) => setTimeout(r, ms));
async function start() {
  server = spawn(
    process.execPath,
    [
      "node_modules/next/dist/bin/next",
      "start",
      "--hostname",
      "127.0.0.1",
      "--port",
      "3002",
    ],
    {
      cwd: process.cwd(),
      env: {
        ...process.env,
        WEDINVITE_ADMIN_USERNAME: "qa-admin",
        WEDINVITE_ADMIN_KEY: password,
        WEDINVITE_DATA_DIR: dataDir,
      },
      stdio: [
        "ignore",
        fs.openSync(path.join(out, "server.log"), "a"),
        fs.openSync(path.join(out, "server.log"), "a"),
      ],
      detached: true,
    },
  );
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(base + "/api/platform")).ok) return;
    } catch {}
    await delay(500);
  }
  throw Error("Test server did not start");
}
function stop() {
  if (server) {
    try {
      process.kill(-server.pid, "SIGTERM");
    } catch {}
    server = null;
  }
}
const headers = async (ctx) => ({
  Origin: base,
  Cookie: (await ctx.cookies()).map((c) => c.name + "=" + c.value).join("; "),
});
const post = async (ctx, data) =>
  ctx.request.post(base + "/api/platform", {
    data,
    headers: await headers(ctx),
  });
const get = async (ctx, url) =>
  ctx.request.get(url, { headers: await headers(ctx) });
const state = async () =>
  await (await get(admin, base + "/api/platform")).json();
async function check(name, fn) {
  try {
    await fn();
    results.push({ name, status: "passed" });
    console.log("PASS " + name);
  } catch (e) {
    results.push({ name, status: "failed", error: e.message });
    console.log("FAIL " + name + " — " + e.message);
    if (page)
      await page
        .screenshot({
          path: path.join(out, "failure-" + results.length + ".png"),
          fullPage: true,
        })
        .catch(() => {});
  }
}
async function dashboard() {
  await page.goto(base + "/admin");
  await page
    .getByPlaceholder("Search customer, phone, order, design or URL…")
    .waitFor();
}
async function openOrder(name) {
  await page
    .getByRole("button", {
      name: new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
    })
    .click();
  await page.getByRole("heading", { name, exact: true }).waitFor();
  return page.locator(".orders-main");
}
const details = {
  groom: "QA Zain",
  bride: "QA Sara",
  groomUr: "زین",
  brideUr: "سارہ",
  family: "With the QA families",
  phone: " 0300 1234567 ",
  events: [
    {
      name: "Nikah",
      date: "2028-03-21",
      time: "18:00",
      venue: "QA Rose Garden",
      address: "Karachi",
    },
  ],
};
async function saveBody(overrides = {}) {
  return {
    action: "save",
    template: "gulistan",
    tier: "premium",
    slug: "qa-api-" + crypto.randomBytes(4).toString("hex"),
    details,
    addons: [],
    ...overrides,
  };
}
(async () => {
  try {
    await start();
    browser = await chromium.launch({
      executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
      args: ["--no-sandbox"],
    });
    admin = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
      permissions: ["clipboard-read", "clipboard-write"],
    });
    guest = await browser.newContext();
    page = await admin.newPage();
    page.setDefaultTimeout(12000);
    page.on("pageerror", (e) => errors.push(e.message));
    await check("Private admin endpoints deny anonymous writes", async () => {
      for (const action of [
        "save",
        "approve",
        "changes",
        "submit",
        "fulfillment",
      ])
        assert.equal(
          (await post(guest, { action, id: "missing" })).status(),
          403,
        );
      const d = await (await guest.request.get(base + "/api/platform")).json();
      assert.equal(d.admin, false);
      assert.deepEqual(d.orders, []);
    });
    await check(
      "Wrong credentials rejected; valid login survives reload",
      async () => {
        await page.goto(base + "/admin");
        await page.getByLabel("Username", { exact: true }).fill("qa-admin");
        await page.getByLabel("Password", { exact: true }).fill("incorrect");
        await page.getByRole("button", { name: "Open studio desk" }).click();
        await page
          .getByRole("alert")
          .filter({ hasText: "incorrect" })
          .waitFor();
        await page.getByLabel("Password", { exact: true }).fill(password);
        await page.getByRole("button", { name: "Open studio desk" }).click();
        await page
          .getByPlaceholder("Search customer, phone, order, design or URL…")
          .waitFor();
        await page.reload();
        await page
          .getByPlaceholder("Search customer, phone, order, design or URL…")
          .waitFor();
      },
    );
    await check(
      "Skipped steps and invalid contact details show actionable errors",
      async () => {
        await page.goto(base + "/admin/create");
        await page
          .getByRole("button", { name: "4. Review & save", exact: true })
          .click();
        await page.locator('input[name="groom"]').waitFor();
        assert(
          (await page.locator(".alert[role=alert]").innerText()).includes(
            "groom",
          ),
        );
        await page.locator('input[name="groom"]').fill("QA Recovery");
        await page.locator('input[name="bride"]').fill("QA Sara");
        await page.locator('input[name="phone"]').fill("123");
        await page.getByRole("button", { name: "Next little detail" }).click();
        assert(
          (await page.locator(".alert[role=alert]").innerText()).includes(
            "WhatsApp",
          ),
        );
        await page.locator('input[name="phone"]').fill("+92 300 1063545");
        await page.getByRole("button", { name: "Next little detail" }).click();
        await page.getByRole("button", { name: "Next little detail" }).click();
        assert(
          (await page.locator(".alert[role=alert]").innerText()).includes(
            "Event 1: choose a valid calendar date",
          ),
        );
        assert(
          (await page.locator(".alert[role=alert]").innerText()).includes(
            "venue name",
          ),
        );
        const body = structuredClone(
          await saveBody({ slug: "qa-invalid-fields" }),
        );
        body.details.phone = "123";
        body.details.events[0].venue = "";
        const response = await post(admin, body);
        assert.equal(response.status(), 400);
        const result = await response.json();
        assert(result.fields.some((i) => i.field === "phone"));
        assert(result.fields.some((i) => i.field === "events.0.venue"));
      },
    );
    const ids = [
      "gulistan",
      "baradari",
      "shabistan",
      "basant",
      "charkha",
      "khat",
      "riwaj",
      "androon",
      "phoolpatti",
      "safar",
    ];
    for (let n = 0; n < ids.length; n++)
      await check(
        ids[n] + ": create, private preview, activate, share and RSVP",
        async () => {
          const issues = [];
          const id = ids[n],
            groom = "QA " + id,
            slug = "qa-" + id,
            tier = ["basic", "premium", "full"][n % 3],
            events = (n % 3) + 1;
          await dashboard();
          await page
            .getByRole("link", { name: "+ Create invitation", exact: true })
            .click();
          await page.locator(".design-picker button").nth(n).click();
          await page
            .locator(".package-picker button")
            .filter({
              hasText: {
                basic: "One celebration",
                premium: "The wedding website",
                full: "The complete suite",
              }[tier],
            })
            .click();
          if (tier === "basic")
            await page.getByLabel("WhatsApp status image").check();
          await page
            .getByRole("button", { name: "Next little detail" })
            .click();
          if (n === 0) {
            await page
              .getByRole("button", { name: "Next little detail" })
              .click();
            assert.equal(
              await page.getByLabel("Groom’s name", { exact: true }).count(),
              1,
            );
          }
          await page.getByLabel("Groom’s name", { exact: true }).fill(groom);
          await page
            .getByLabel("Bride’s name", { exact: true })
            .fill("QA Sara");
          await page.getByLabel("Groom’s name in Urdu (optional)").fill("زین");
          await page.getByLabel("Bride’s name in Urdu (optional)").fill("سارہ");
          await page
            .getByLabel("Host / family message (optional)")
            .fill("With the QA families");
          await page
            .getByLabel("Customer WhatsApp number", { exact: true })
            .fill(details.phone);
          await page
            .getByRole("button", { name: "Next little detail" })
            .click();
          for (let i = 1; i < events; i++)
            await page
              .getByRole("button", { name: "+ Add a celebration", exact: true })
              .click();
          for (let i = 0; i < events; i++) {
            const f = page.locator(".event-form").nth(i);
            for (const [label, value] of Object.entries({
              "Event name": ["Nikah", "Baraat", "Walima"][i],
              Date: "2028-03-" + (21 + i),
              Time: "18:30",
              "Venue name": "QA Venue " + (i + 1),
              "Venue address (optional)": "Karachi",
            }))
              await f.getByLabel(label, { exact: true }).fill(value);
          }
          await page
            .getByRole("button", { name: "Next little detail" })
            .click();
          await page.getByLabel("Custom invitation URL").fill(slug);
          await page.getByRole("checkbox", { name: "I’ve checked" }).check();
          await page
            .getByRole("button", { name: "Create private invitation" })
            .click();
          await page.waitForURL(base + "/admin");
          await page
            .getByPlaceholder("Search customer, phone, order, design or URL…")
            .waitFor();
          const snapshot = await state();
          assert(snapshot.admin, "Test harness did not send admin cookie");
          const o = snapshot.orders.find((o) => o.slug === slug);
          assert(o);
          assert.equal(o.status, "draft");
          assert.equal(
            o.amount,
            { basic: 5299, premium: 7999, full: 11999 }[tier],
          );
          assert.equal(o.details.events.length, events);
          assert.equal(
            (
              await guest.request.get(
                base + "/api/invitation/" + slug + "?preview=1",
              )
            ).status(),
            403,
          );
          let card = await openOrder(groom + " & QA Sara");
          assert.equal(
            await card.getByRole("button", { name: "Copy live link" }).count(),
            0,
          );
          await card
            .getByRole("link", { name: "Preview", exact: false })
            .click();
          const wrapper = page.frameLocator("iframe");
          const frame = wrapper.frameLocator("iframe");
          const originalViewport = page.viewportSize();
          for (const width of [1440, 760, 759, 390]) {
            await page.setViewportSize({ width, height: 900 });
            await page.waitForTimeout(200);
            assert.equal(
              await wrapper
                .locator(".demo-frame")
                .evaluate((el) => getComputedStyle(el).display),
              width >= 760 ? "block" : "none",
            );
            if (width < 760)
              assert.equal(
                Math.round(
                  await wrapper
                    .locator(".demo-device")
                    .evaluate((el) => el.getBoundingClientRect().width),
                ),
                width,
              );
          }
          assert(
            (await wrapper.locator("iframe").getAttribute("src")).startsWith(
              "/api/invitation/",
            ),
          );
          assert.equal(
            await wrapper
              .locator(".demo-book")
              .evaluate((el) => getComputedStyle(el).display),
            "none",
          );
          if (n === 0)
            await page.screenshot({
              path: path.join(out, "admin-preview-mobile.png"),
            });
          await page.setViewportSize(originalViewport);
          await page.waitForTimeout(200);
          if (n === 0)
            await page.screenshot({
              path: path.join(out, "admin-preview-desktop.png"),
            });
          await frame.locator("#entrance").click();
          await frame.locator("body:not(.locked)").waitFor({ timeout: 25000 });
          const body = await frame.locator("body").innerText();
          assert(body.includes(groom));
          assert(body.includes("QA Venue 1"));
          await frame.locator("#studioRsvp").click({ force: true });
          await page
            .getByRole("heading", { name: "A little reply, with love." })
            .waitFor();
          await page
            .getByRole("button", { name: "Close ×", exact: true })
            .click();
          if (body.includes("Abbasi") || body.includes("Kiyani"))
            issues.push(
              "Original sample family names remain in personalized invitation",
            );
          await dashboard();
          card = await openOrder(groom + " & QA Sara");
          await card
            .getByRole("button", {
              name: "Verify payment & activate",
              exact: true,
            })
            .click();
          await card.getByText("Paid", { exact: true }).first().waitFor();
          assert.equal(
            (
              await guest.request.get(base + "/api/invitation/" + slug)
            ).status(),
            200,
          );
          await card.getByRole("button", { name: "Copy live link" }).click();
          assert.equal(
            await page.evaluate(() => navigator.clipboard.readText()),
            base + "/invite/" + slug,
          );
          const customer = await card
            .getByRole("link", { name: "Message customer" })
            .getAttribute("href");
          if (!customer.startsWith("https://wa.me/923001234567?"))
            issues.push("Customer WhatsApp number is not normalized");
          const share = decodeURIComponent(
            await card
              .getByRole("link", { name: "Share on WhatsApp" })
              .getAttribute("href"),
          );
          assert(share.includes(base + "/invite/" + slug));
          const gp = await guest.newPage();
          gp.on("pageerror", (e) => errors.push(e.message));
          await gp.goto(base + "/invite/" + slug);
          await gp.getByRole("button", { name: "Reply with love" }).click();
          await gp.getByLabel("Your name", { exact: true }).fill("Guest " + id);
          await gp.getByLabel("Number of guests").fill("3");
          await gp.getByRole("button", { name: "Send my reply" }).click();
          await gp
            .getByRole("status")
            .filter({ hasText: "Thank you" })
            .waitFor();
          await gp.close();
          await dashboard();
          card = await openOrder(groom + " & QA Sara");
          await card.getByText("Guest " + id, { exact: true }).waitFor();
          assert(
            (await card
              .getByText("Attending · 3 guests", { exact: true })
              .count()) === 1,
          );
          if (n === 0)
            await page.screenshot({
              path: path.join(out, "dashboard-desktop.png"),
              fullPage: true,
            });
          assert.deepEqual(issues, []);
        },
      );
    await check("Duplicate URLs and invalid dates are rejected", async () => {
      const d = await state();
      const existing = d.orders[0];
      assert(existing);
      assert.equal(
        (await post(admin, await saveBody({ slug: existing.slug }))).status(),
        400,
      );
      assert.equal(
        (await post(admin, await saveBody({ slug: existing.id }))).status(),
        400,
        "URL can shadow another invitation ID",
      );
      const bad = await post(
        admin,
        await saveBody({
          details: {
            ...details,
            events: [{ ...details.events[0], date: "2028-02-31" }],
          },
        }),
      );
      assert.equal(bad.status(), 400, "Invalid calendar date accepted");
    });
    await check(
      "Editing an unknown order does not silently create another",
      async () => {
        assert.equal(
          (await post(admin, await saveBody({ id: "missing-order" }))).status(),
          404,
        );
      },
    );
    await check(
      "Edit, correction note, URL rename and persistence",
      async () => {
        const draft = await (
          await post(admin, await saveBody({ slug: "qa-edit-flow" }))
        ).json();
        await dashboard();
        let c = await openOrder("QA Zain & QA Sara");
        await c
          .getByLabel("Details to correct")
          .fill("Please confirm the venue.");
        await c.getByRole("button", { name: "Request corrections" }).click();
        await c
          .getByText("Please confirm the venue.", { exact: true })
          .waitFor();
        await c.getByRole("link", { name: "Edit details" }).click();
        await page
          .getByRole("button", { name: "2. Couple & contact", exact: true })
          .click();
        await page
          .getByLabel("Groom’s name", { exact: true })
          .fill("QA Edited");
        await page
          .getByRole("button", { name: "3. Events & venues", exact: true })
          .click();
        await page
          .getByLabel("Venue name", { exact: true })
          .fill("QA Updated Venue");
        await page
          .getByRole("button", { name: "4. Review & save", exact: true })
          .click();
        await page.getByLabel("Custom invitation URL").fill("qa-edited-link");
        await page.getByRole("checkbox", { name: "I’ve checked" }).check();
        await page
          .getByRole("button", {
            name: /Create private invitation|Save invitation/,
          })
          .click();
        await page.waitForURL(base + "/admin");
        await page
          .getByPlaceholder("Search customer, phone, order, design or URL…")
          .waitFor();
        let o = (await state()).orders.find((o) => o.id === draft.id);
        assert.equal(o.details.groom, "QA Edited");
        assert.equal(o.details.events[0].venue, "QA Updated Venue");
        assert.equal(o.slug, "qa-edited-link");
        assert.equal(
          (
            await guest.request.get(base + "/api/invitation/qa-edit-flow")
          ).status(),
          403,
        );
        await page
          .getByPlaceholder("Search customer, phone, order, design or URL…")
          .fill("qa-edited-link");
        assert.equal(await page.locator(".orders-list tbody tr").count(), 1);
        await page.setViewportSize({ width: 390, height: 844 });
        await page.screenshot({
          path: path.join(out, "dashboard-mobile.png"),
          fullPage: true,
        });
        assert(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        );
        await page.setViewportSize({ width: 1440, height: 1000 });
        stop();
        await delay(600);
        await start();
        await dashboard();
        assert(
          (await state()).orders.some(
            (o) => o.id === draft.id && o.details.groom === "QA Edited",
          ),
        );
      },
    );
    await check(
      "Order fulfillment is authenticated, payment-gated, filterable and persistent",
      async () => {
        const d = await (
          await post(admin, await saveBody({ slug: "qa-fulfillment" }))
        ).json();
        assert.equal(
          (
            await post(admin, {
              action: "fulfillment",
              id: d.id,
              fulfillment: "ready",
            })
          ).status(),
          400,
        );
        assert.equal(
          (
            await post(admin, {
              action: "fulfillment",
              id: d.id,
              fulfillment: "invalid",
            })
          ).status(),
          400,
        );
        await dashboard();
        let c = await openOrder("QA Zain & QA Sara");
        await c
          .getByLabel("Update fulfillment status")
          .selectOption("in_progress");
        await c.getByRole("button", { name: "Save fulfillment" }).click();
        await c.getByRole("status").waitFor();
        assert.equal(
          (await state()).orders.find((o) => o.id === d.id).fulfillment,
          "in_progress",
        );
        await c
          .getByRole("button", {
            name: "Verify payment & activate",
            exact: true,
          })
          .click();
        await c.getByText("Paid", { exact: true }).first().waitFor();
        for (const status of ["ready", "delivered"]) {
          await c.getByLabel("Update fulfillment status").selectOption(status);
          await c.getByRole("button", { name: "Save fulfillment" }).click();
          await c.getByRole("status").waitFor();
          assert.equal(
            (await state()).orders.find((o) => o.id === d.id).fulfillment,
            status,
          );
        }
        assert((await state()).orders.find((o) => o.id === d.id).fulfilledAt);
        await dashboard();
        await page.getByRole("tab", { name: "Delivered", exact: true }).click();
        assert.equal(await page.locator("tbody tr").count(), 1);
        await page
          .getByRole("tab", { name: "Unfulfilled", exact: true })
          .click();
        assert.equal(
          await page.getByRole("button", { name: /QA Zain & QA Sara/ }).count(),
          0,
        );
        await page.getByRole("tab", { name: "All", exact: true }).click();
        await page.getByLabel("Sort orders").selectOption("value");
        const totals = await page
          .locator("tbody tr td:last-child")
          .allTextContents();
        const nums = totals.map((s) => Number(s.replace(/[^0-9]/g, "")));
        assert.deepEqual(
          nums,
          [...nums].sort((a, b) => b - a),
        );
        await page.screenshot({
          path: path.join(out, "orders-list-desktop.png"),
          fullPage: true,
        });
        await page.setViewportSize({ width: 390, height: 844 });
        await page.screenshot({
          path: path.join(out, "orders-list-mobile.png"),
          fullPage: true,
        });
        assert(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        );
        c = await openOrder("QA Zain & QA Sara");
        await page.screenshot({
          path: path.join(out, "order-details-mobile.png"),
          fullPage: true,
        });
        assert(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        );
        await page.setViewportSize({ width: 1440, height: 1000 });
        stop();
        await delay(600);
        await start();
        assert.equal(
          (await state()).orders.find((o) => o.id === d.id).fulfillment,
          "delivered",
        );
      },
    );
    await check("Concurrent guest replies are all retained", async () => {
      const r = await (
        await post(admin, await saveBody({ slug: "qa-concurrent" }))
      ).json();
      assert.equal(
        (await post(admin, { action: "approve", id: r.id })).status(),
        200,
      );
      const responses = await Promise.all(
        Array.from({ length: 20 }, (_, i) =>
          post(guest, {
            action: "rsvp",
            id: r.id,
            name: "Concurrent " + i,
            count: 1,
            attending: true,
          }),
        ),
      );
      assert(responses.every((r) => r.status() === 200));
      assert.equal(
        (await state()).rsvps.filter((x) => x.orderId === r.id).length,
        20,
      );
    });
    await check(
      "Logout revokes the server session, including copied cookies",
      async () => {
        const cookies = await admin.cookies();
        await dashboard();
        await page
          .getByRole("button", { name: "Sign out", exact: true })
          .click();
        await page.getByLabel("Username", { exact: true }).waitFor();
        assert.equal((await state()).admin, false);
        const replay = await browser.newContext();
        await replay.addCookies(cookies);
        const d = await (await get(replay, base + "/api/platform")).json();
        await replay.close();
        assert.equal(
          d.admin,
          false,
          "Logged-out cookie still grants admin access",
        );
      },
    );
    await check("Browser has no runtime errors", async () =>
      assert.deepEqual([...new Set(errors)], []),
    );
  } finally {
    stop();
    if (browser) await browser.close();
    fs.writeFileSync(
      path.join(out, "results.json"),
      JSON.stringify({ results, errors }, null, 2),
    );
    fs.rmSync(dataDir, { recursive: true, force: true });
    console.log(
      JSON.stringify({
        passed: results.filter((r) => r.status === "passed").length,
        failed: results.filter((r) => r.status === "failed").length,
      }),
    );
    if (results.some((r) => r.status === "failed")) process.exitCode = 1;
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
