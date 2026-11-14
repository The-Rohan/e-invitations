const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
const base = "http://127.0.0.1:3003";
const dataDir = fs.mkdtempSync("/tmp/wed-crm-");
const password = crypto.randomBytes(24).toString("hex");
const out = path.resolve("artifacts/crm-tests");
fs.mkdirSync(out, { recursive: true });
const server = spawn(
  process.execPath,
  [
    "node_modules/next/dist/bin/next",
    "start",
    "--hostname",
    "127.0.0.1",
    "--port",
    "3003",
  ],
  {
    env: {
      ...process.env,
      WEDINVITE_ADMIN_USERNAME: "qa-admin",
      WEDINVITE_ADMIN_KEY: password,
      WEDINVITE_DATA_DIR: dataDir,
    },
    stdio: [
      "ignore",
      fs.openSync(path.join(out, "server.log"), "w"),
      fs.openSync(path.join(out, "server-error.log"), "w"),
    ],
  },
);
let browser;
const results = [];
async function check(name, fn) {
  await fn();
  results.push(name);
  console.log("PASS " + name);
}
async function until(fn) {
  for (let i = 0; i < 80; i++) {
    if (await fn()) return;
    await new Promise((r) => setTimeout(r, 250));
  }
  throw Error("Timed out waiting for condition");
}
(async () => {
  try {
    await until(async () => {
      try {
        return (await fetch(base + "/api/platform")).ok;
      } catch {
        return false;
      }
    });
    browser = await chromium.launch({
      executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
      args: ["--no-sandbox"],
    });
    const customer = await browser.newContext(),
      admin = await browser.newContext();
    const page = await customer.newPage();
    const desk = await admin.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    desk.on("pageerror", (e) => errors.push(e.message));
    const authHeaders = async (ctx) => ({
      Cookie: (await ctx.cookies())
        .map((c) => c.name + "=" + c.value)
        .join("; "),
    });
    const post = async (ctx, url, data, extra = {}) =>
      ctx.request.post(base + url, {
        data,
        headers: { Origin: base, ...(await authHeaders(ctx)), ...extra },
      });
    const get = async (ctx, url) =>
      ctx.request.get(base + url, { headers: await authHeaders(ctx) });
    await check("CRM denies anonymous reads and writes", async () => {
      assert.equal(
        (await customer.request.get(base + "/api/crm")).status(),
        401,
      );
      assert.equal(
        (
          await post(customer, "/api/crm", { id: "fake", revision: 0 })
        ).status(),
        401,
      );
    });
    await check("Admin login and empty CRM", async () => {
      assert.equal(
        (
          await post(admin, "/api/platform", {
            action: "admin-login",
            username: "qa-admin",
            password,
          })
        ).status(),
        200,
      );
      await desk.goto(base + "/admin/crm");
      await desk.getByText("Room for your next hello.").waitFor();
    });
    await check(
      "Product context, partial autosave and live CRM visibility",
      async () => {
        await page.goto(base + "/order?template=safar&tier=full");
        await page.locator("#customer-name").fill("Ayesha CRM Test");
        await until(async () => {
          const d = await (await get(admin, "/api/crm")).json();
          return d.leads.length === 1 && d.leads[0].name === "Ayesha CRM Test";
        });
        await desk.getByRole("button", { name: /Ayesha CRM Test/ }).waitFor();
        assert.equal(
          (await page.locator(".order-summary").innerText()).includes("11,999"),
          true,
        );
      },
    );
    let draft = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("wedinvite-order-v1")),
    );
    await check(
      "Own resume is private and contains no staff data",
      async () => {
        const r = await customer.request.get(base + "/api/leads", {
          headers: { Authorization: "Bearer " + draft.token },
        });
        const d = await r.json();
        assert.equal(d.lead.name, "Ayesha CRM Test");
        assert.equal(d.lead.notes, undefined);
        const stranger = await customer.request.get(base + "/api/leads", {
          headers: {
            Authorization: "Bearer " + crypto.randomBytes(32).toString("hex"),
          },
        });
        assert.equal((await stranger.json()).lead, null);
      },
    );
    await check("Refresh restores saved contact and selection", async () => {
      await page.reload();
      assert.equal(
        await page.locator("#customer-name").inputValue(),
        "Ayesha CRM Test",
      );
      assert(
        (await page.locator(".order-summary").innerText()).includes("Safar"),
      );
    });
    await check(
      "Temporary network failure queues changes and recovers",
      async () => {
        await customer.setOffline(true);
        await page.locator("#customer-phone").fill("03001063545");
        await page
          .getByText("Connection interrupted — retrying automatically")
          .waitFor();
        await customer.setOffline(false);
        await page.getByText("All changes saved", { exact: true }).waitFor();
        await page.reload();
        assert.equal(
          await page.locator("#customer-phone").inputValue(),
          "03001063545",
        );
      },
    );
    await check(
      "Guided steps, original pricing, payment claim and WhatsApp handoff",
      async () => {
        await page
          .getByRole("button", { name: "Choose my invitation" })
          .click();
        await page
          .getByRole("heading", { name: "A design you’ll love to share." })
          .waitFor();
        assert.equal(await page.locator(".order-designs article").count(), 10);
        await page.screenshot({
          path: path.join(out, "order-desktop.png"),
          fullPage: true,
        });
        await page.getByRole("button", { name: "Continue to payment" }).click();
        await page.getByRole("checkbox").check();
        await page
          .getByRole("button", { name: "Continue to WhatsApp details" })
          .click();
        await page.getByText("All changes saved", { exact: true }).waitFor();
        const href = await page
          .getByRole("link", { name: "Continue on WhatsApp" })
          .getAttribute("href");
        assert(href.startsWith("https://wa.me/923001063545"));
        assert(
          decodeURIComponent(href).includes("awaiting manual verification"),
        );
        await page.route("https://wa.me/**", (r) =>
          r.fulfill({ status: 200, body: "Test: message not sent" }),
        );
        const popup = page.waitForEvent("popup");
        await page.getByRole("link", { name: "Continue on WhatsApp" }).click();
        await (await popup).close();
        await page.getByText("All changes saved", { exact: true }).waitFor();
      },
    );
    let lead = (await (await get(admin, "/api/crm")).json()).leads[0];
    await check(
      "CRM step history, unverified claim, notes and follow-up",
      async () => {
        assert.equal(lead.maxStep, 3);
        assert.equal(lead.paymentVerified, false);
        assert.equal(lead.whatsappOpened, true);
        await desk.getByRole("button", { name: /Ayesha CRM Test/ }).click();
        await desk.locator("input[name=assignee]").fill("Studio team");
        await desk
          .locator("textarea[name=note]")
          .fill("Customer requested an evening delivery.");
        await desk.locator("input[name=followUp]").fill("2026-11-15T14:00");
        await desk.getByRole("button", { name: "Save follow-up" }).click();
        await until(async () => {
          lead = (await (await get(admin, "/api/crm")).json()).leads[0];
          return lead.notes.length === 1;
        });
        assert.equal(lead.assignee, "Studio team");
        assert.equal(lead.followUp, "2026-11-15T09:00:00.000Z");
        await desk.screenshot({
          path: path.join(out, "crm-desktop.png"),
          fullPage: true,
        });
      },
    );
    await check(
      "Idempotent retry and out-of-order save protection",
      async () => {
        draft = await page.evaluate(() =>
          JSON.parse(localStorage.getItem("wedinvite-order-v1")),
        );
        const headers = { Authorization: "Bearer " + draft.token };
        assert.equal(
          (
            await post(
              customer,
              "/api/leads",
              { revision: draft.revision, data: draft.data },
              headers,
            )
          ).status(),
          200,
        );
        assert.equal(
          (
            await post(
              customer,
              "/api/leads",
              {
                revision: draft.revision - 1,
                data: { ...draft.data, name: "OLD" },
              },
              headers,
            )
          ).status(),
          409,
        );
        assert.equal(
          (await (await get(admin, "/api/crm")).json()).leads.length,
          1,
        );
      },
    );
    await check("CRM optimistic conflict protection", async () => {
      assert.equal(
        (
          await post(admin, "/api/crm", {
            id: lead.id,
            revision: lead.adminRevision - 1,
            stage: "Lost",
          })
        ).status(),
        409,
      );
    });
    let orderId;
    await check(
      "Lead converts into a linked invitation without duplicate conversion",
      async () => {
        const details = {
          groom: "Bilal",
          bride: "Ayesha",
          groomUr: "",
          brideUr: "",
          family: "Together with family",
          phone: "03001063545",
          events: [
            {
              name: "Wedding",
              date: "2027-03-20",
              time: "19:00",
              venue: "Lahore Hall",
              address: "Lahore",
            },
          ],
        };
        const body = {
          action: "save",
          leadId: lead.id,
          template: "safar",
          tier: "full",
          addons: [],
          details,
          slug: "crm-test-couple",
        };
        const r = await post(admin, "/api/platform", body);
        assert.equal(r.status(), 200, await r.text());
        orderId = (await r.json()).id;
        assert.equal((await post(admin, "/api/platform", body)).status(), 409);
        lead = (await (await get(admin, "/api/crm")).json()).leads[0];
        assert.equal(lead.orderId, orderId);
        assert.equal(lead.stage, "In production");
        assert.equal(
          (
            await customer.request.get(base + "/api/invitation/" + orderId)
          ).status(),
          403,
        );
      },
    );
    await check(
      "Activation, delivery pipeline and existing order retained after lead saves",
      async () => {
        assert.equal(
          (
            await post(admin, "/api/platform", {
              action: "approve",
              id: orderId,
            })
          ).status(),
          200,
        );
        assert.equal(
          (
            await customer.request.get(base + "/api/invitation/" + orderId)
          ).status(),
          200,
        );
        lead = (await (await get(admin, "/api/crm")).json()).leads[0];
        assert.equal(lead.paymentVerified, true);
        assert.equal(
          (
            await post(admin, "/api/crm", {
              id: lead.id,
              revision: lead.adminRevision,
              stage: "Delivered",
            })
          ).status(),
          200,
        );
        let linked = (
          await (await get(admin, "/api/platform")).json()
        ).orders.find((o) => o.id === orderId);
        assert.equal(linked.fulfillment, "delivered");
        assert(linked.fulfilledAt);
        assert.equal(linked.leadId, lead.id);
        assert.equal(
          (
            await post(admin, "/api/platform", {
              action: "fulfillment",
              id: orderId,
              fulfillment: "ready",
            })
          ).status(),
          200,
        );
        lead = (await (await get(admin, "/api/crm")).json()).leads[0];
        assert.equal(lead.stage, "Ready");
        await desk.goto(base + "/admin/crm?order=" + orderId);
        await desk
          .getByRole("heading", { name: lead.name, exact: true })
          .waitFor();
        draft.data.name = "Ayesha Updated";
        draft.revision++;
        assert.equal(
          (
            await post(
              customer,
              "/api/leads",
              { revision: draft.revision, data: draft.data },
              { Authorization: "Bearer " + draft.token },
            )
          ).status(),
          200,
        );
        assert.equal(
          (await (await get(admin, "/api/platform")).json()).orders.length,
          1,
        );
      },
    );
    await check("Mobile layout and browser runtime", async () => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(base + "/order");
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      await page.screenshot({
        path: path.join(out, "order-mobile.png"),
        fullPage: true,
      });
      await desk.setViewportSize({ width: 390, height: 844 });
      await desk.reload();
      await desk.getByRole("button", { name: /Ayesha Updated/ }).click();
      assert(
        await desk.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      await desk.screenshot({
        path: path.join(out, "crm-mobile.png"),
        fullPage: true,
      });
      assert.deepEqual(errors, []);
    });
    console.log(results.length + " checks passed");
    fs.writeFileSync(
      path.join(out, "results.json"),
      JSON.stringify({ passed: results }, null, 2),
    );
  } finally {
    await browser?.close();
    server.kill("SIGTERM");
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
