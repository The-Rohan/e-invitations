const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const { spawn } = require("node:child_process");
const fs = require("node:fs"),
  crypto = require("node:crypto"),
  assert = require("node:assert/strict");
const base = "http://127.0.0.1:3005",
  dir = fs.mkdtempSync("/tmp/wed-orders-"),
  password = crypto.randomBytes(24).toString("hex");
fs.mkdirSync("artifacts/order-navigation", { recursive: true });
const server = spawn(
  process.execPath,
  [
    "node_modules/next/dist/bin/next",
    "start",
    "--hostname",
    "127.0.0.1",
    "--port",
    "3005",
  ],
  {
    env: {
      ...process.env,
      WEDINVITE_DATA_DIR: dir,
      WEDINVITE_ADMIN_USERNAME: "qa-admin",
      WEDINVITE_ADMIN_KEY: password,
    },
    stdio: "ignore",
  },
);
let browser;
(async () => {
  try {
    for (let i = 0; i < 60; i++) {
      try {
        if ((await fetch(base + "/api/platform")).ok) break;
      } catch {}
      await new Promise((r) => setTimeout(r, 250));
    }
    browser = await chromium.launch({
      executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
      args: ["--no-sandbox"],
    });
    const ctx = await browser.newContext({
        viewport: { width: 1440, height: 1000 },
      }),
      page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    const post = async (body) =>
      ctx.request.post(base + "/api/platform", {
        headers: {
          Origin: base,
          Cookie: (await ctx.cookies())
            .map((c) => c.name + "=" + c.value)
            .join("; "),
        },
        data: body,
      });
    assert.equal(
      (
        await post({ action: "admin-login", username: "qa-admin", password })
      ).status(),
      200,
    );
    const details = {
      groom: "QA Order",
      bride: "QA Customer",
      phone: "03001234567",
      groomUr: "",
      brideUr: "",
      family: "",
      events: [
        {
          name: "Nikah",
          date: "2028-03-21",
          time: "18:30",
          venue: "QA Garden",
          address: "Karachi",
        },
      ],
    };
    const d = await (
      await post({
        action: "save",
        template: "gulistan",
        tier: "premium",
        addons: [],
        slug: "qa-order-navigation",
        details,
      })
    ).json();
    await post({ action: "submit", id: d.id, transaction: "QA Reference" });
    await page.goto(base + "/admin");
    await page
      .getByRole("tab", { name: "Payment review", exact: true })
      .click();
    assert.equal(await page.locator("tbody tr").count(), 1);
    const search = await page.getByLabel("Search orders").boundingBox();
    const sort = await page.getByLabel("Sort orders").boundingBox();
    assert(
      search.width > sort.width * 2,
      "Search should be the primary filter",
    );
    await page.getByRole("button", { name: /QA Order & QA Customer/ }).click();
    assert(new URL(page.url()).searchParams.get("order") === d.id);
    await page.reload();
    await page
      .getByRole("heading", { name: "QA Order & QA Customer", exact: true })
      .waitFor();
    await page.goBack();
    await page.getByLabel("Search orders").waitFor();
    await page.goForward();
    await page
      .getByRole("heading", { name: "QA Order & QA Customer", exact: true })
      .waitFor();
    await page
      .locator(".orders-sidebar")
      .getByRole("link", { name: /Orders/ })
      .click();
    await page.getByLabel("Search orders").waitFor();
    await page.getByLabel("Search orders").fill("no-such-order");
    await page
      .getByRole("heading", { name: "No orders match this view." })
      .waitFor();
    await page.getByLabel("Search orders").fill("");
    await page.screenshot({
      path: "artifacts/order-navigation/orders-desktop.png",
      fullPage: true,
    });
    await page.getByRole("button", { name: /QA Order & QA Customer/ }).click();
    await page
      .getByRole("button", { name: "Verify payment & activate", exact: true })
      .click();
    await page.getByText("Paid", { exact: true }).first().waitFor();
    await page.getByLabel("Update fulfillment status").selectOption("ready");
    await page.getByRole("button", { name: "Save fulfillment" }).click();
    await page.getByRole("status").waitFor();
    await page.screenshot({
      path: "artifacts/order-navigation/details-desktop.png",
      fullPage: true,
    });
    for (const width of [768, 390, 320]) {
      await page.setViewportSize({ width, height: 844 });
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      if (width === 390)
        await page.screenshot({
          path: "artifacts/order-navigation/details-mobile.png",
          fullPage: true,
        });
      await page.getByRole("button", { name: "← All orders" }).click();
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      await page
        .getByRole("tab", { name: "Ready to deliver", exact: true })
        .click();
      await page
        .getByRole("button", { name: /QA Order & QA Customer/ })
        .click();
    }
    assert.deepEqual(errors, []);
    console.log(
      "PASS: pending payment view, usable search, order deep links, reload/back/forward/sidebar, empty search, activation, fulfillment, 768/390/320 layouts and no runtime errors",
    );
  } finally {
    if (browser) await browser.close();
    server.kill("SIGTERM");
    fs.rmSync(dir, { recursive: true, force: true });
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
