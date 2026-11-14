const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const base = process.env.TEST_BASE || "http://127.0.0.1:3000";
(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    args: ["--no-sandbox"],
  });
  try {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1000 },
    });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    fs.mkdirSync("artifacts/storefront-updates", { recursive: true });
    for (const width of [1440, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(base);
      await page
        .locator(".at-hero-scene .phone-mockup-frame")
        .first()
        .waitFor();
      assert.equal(
        await page.locator(".at-hero-scene .phone-mockup").count(),
        3,
      );
      assert.equal(
        await page.locator(".wv-design-card .phone-mockup").count(),
        4,
      );
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      for (const phone of [
        page.locator(".at-featured-film .phone-mockup"),
        page.locator(".wv-card-phone .phone-mockup").first(),
      ]) {
        const [w, h] = await phone.evaluate((el) => [
          el.clientWidth,
          el.clientHeight,
        ]);
        assert(
          Math.abs(w / h - 612 / 1258) < 0.005,
          "Phone aspect ratio must match original iPhone frame",
        );
      }
      await page
        .locator(".at-hero-scene")
        .screenshot({ path: `artifacts/storefront-updates/hero-${width}.png` });
      await page
        .locator(".wv-design-card")
        .first()
        .screenshot({
          path: `artifacts/storefront-updates/design-${width}.png`,
        });
      assert(
        await page
          .locator(".wv-design-card .phone-mockup-frame")
          .first()
          .evaluate((el) => el.complete && el.naturalWidth > 0),
      );
      assert.equal(
        await page
          .locator(".wv-card-phone")
          .first()
          .evaluate((el) => getComputedStyle(el).outlineStyle),
        "none",
      );
      await page.goto(base + "/templates");
      assert.equal(
        await page.locator(".wv-design-card .phone-mockup").count(),
        10,
      );
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
    for (const [n, id] of [
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
    ].entries()) {
      await page.goto(base + "/templates/" + id);
      await page.locator(".at-offer-picker>.at-primary").click();
      await page.locator("#customer-name").waitFor();
      assert.equal(
        (await page.locator(".order-summary h2").innerText())
          .toLowerCase()
          .replaceAll(" ", ""),
        id,
      );
      if (n === 0) {
        await page.locator("#customer-name").fill("QA Selection Resume");
        await page.getByText("All changes saved", { exact: true }).waitFor();
      } else
        assert.equal(
          await page.locator("#customer-name").inputValue(),
          "QA Selection Resume",
        );
      await page.reload();
      await page.locator("#customer-name").waitFor();
      assert.equal(
        (await page.locator(".order-summary h2").innerText())
          .toLowerCase()
          .replaceAll(" ", ""),
        id,
      );
      assert.equal(
        await page.locator("#customer-name").inputValue(),
        "QA Selection Resume",
      );
    }
    assert.deepEqual(errors, []);
    console.log(
      "PASS: hero, featured and all 10 collection iPhone mockups, correct proportions, no overflow at 1440/768/390/320, all 10 product selections preserved through resume and reload, no browser errors",
    );
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
