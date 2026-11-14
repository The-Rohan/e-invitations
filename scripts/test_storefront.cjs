const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const assert = require("node:assert/strict");
const base = process.env.BASE_URL || "http://127.0.0.1:3000";
require("node:fs").mkdirSync("artifacts", { recursive: true });
(async () => {
  const b = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    args: ["--no-sandbox"],
  });
  try {
    const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
    const errors = [];
    p.on("pageerror", (e) => errors.push(e.message));
    const capturePage = async (path) => {
      await p.evaluate(async () => {
        for (let y = 0; y < document.documentElement.scrollHeight; y += 700) {
          window.scrollTo({ top: y, behavior: "instant" });
          await new Promise((r) => setTimeout(r, 70));
        }
        window.scrollTo({ top: 0, behavior: "instant" });
        await Promise.all(
          Array.from(document.images, (img) => img.decode().catch(() => {})),
        );
      });
      await p.screenshot({ path, fullPage: true });
    };
    await p.goto(base, { waitUntil: "networkidle" });
    await capturePage("artifacts/home-desktop.png");
    await p.screenshot({ path: "artifacts/home-hero.png" });
    await p.getByRole("button", { name: "Show Baradari" }).click();
    await p.getByRole("button", { name: "Experience Baradari" }).click();
    await p.getByRole("dialog").waitFor();
    assert(await p.getByRole("dialog").locator("iframe").count());
    await p.keyboard.press("Escape");
    assert.equal(await p.getByRole("dialog").count(), 0);
    await p.goto(base + "/templates");
    await p.getByRole("button", { name: "Save Gulistan", exact: true }).click();
    await p.reload();
    await p
      .getByRole("button", { name: "Remove Gulistan", exact: true })
      .waitFor();
    await p.getByRole("button", { name: "Saved (1)", exact: true }).click();
    assert.equal(await p.locator(".wv-design-card").count(), 1);
    await p.getByRole("button", { name: "All designs", exact: true }).click();
    await p.getByRole("textbox", { name: "Search designs" }).fill("midnight");
    assert.equal(await p.locator(".wv-design-card").count(), 1);
    await p.getByRole("button", { name: "Clear search" }).click();
    await p.locator(".wv-design-card input").nth(0).check();
    await p.locator(".wv-design-card input").nth(1).check();
    await p
      .getByRole("button", { name: "Compare designs", exact: true })
      .click();
    assert.equal(await p.locator(".wv-compare-grid>div").count(), 2);
    await p.keyboard.press("Escape");
    await p.getByRole("button", { name: "Clear comparison" }).click();
    await capturePage("artifacts/collection-desktop.png");
    for (const id of [
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
    ]) {
      await p.goto(base + "/templates/" + id);
      assert.equal(await p.locator(".wv-product-device").count(), 1);
      await p
        .getByRole("button", { name: "The invitation", exact: true })
        .click();
      await p.locator(".wv-product-device>img").evaluate((img) => img.decode());
      await p.getByRole("button", { name: "The details", exact: true }).click();
      await p.locator(".wv-product-device>img").evaluate((img) => img.decode());
      await p
        .getByRole("radio", { name: /The complete suite.*11,999/ })
        .click();
      const url = await p
        .locator(".at-offer-picker>.at-primary")
        .getAttribute("href");
      assert(
        url.includes("923001063545") &&
          decodeURIComponent(url).includes("The complete suite"),
      );
      console.log(id + ": gallery and WhatsApp package CTA passed");
    }
    await p.goto(base + "/templates/gulistan", { waitUntil: "networkidle" });
    await capturePage("artifacts/product-desktop.png");
    const popupPromise = p.waitForEvent("popup");
    await p.locator(".wv-related .wv-quick-button").first().click();
    const popup = await popupPromise;
    await popup.waitForLoadState();
    assert((await popup.locator("iframe").getAttribute("src")).includes("khat.html"));
    assert.equal(await popup.locator(".sample-watermarks span").count(), 9);
    await popup.close();
    await p.setViewportSize({ width: 390, height: 844 });
    await p.goto(base, { waitUntil: "networkidle" });
    await capturePage("artifacts/home-mobile.png");
    assert(
      await p.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    await p.getByRole("button", { name: "Open menu", exact: true }).click();
    await p
      .getByRole("navigation", { name: "Mobile navigation" })
      .getByRole("link", { name: "The collection" })
      .click();
    assert.equal(
      await p.getByRole("navigation", { name: "Mobile navigation" }).count(),
      0,
    );
    await p.goto(base + "/templates/khat", { waitUntil: "networkidle" });
    await capturePage("artifacts/product-mobile.png");
    assert(
      await p.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    await p.emulateMedia({ reducedMotion: "reduce" });
    await p.goto(base, { waitUntil: "networkidle" });
    assert(await p.locator(".at-hero video").evaluate((v) => v.paused));
    console.log("Reduced-motion preference and related-design preview passed.");
    if (process.env.TEST_ADMIN_PASSWORD) {
      await p.goto(base + "/admin");
      await p
        .locator("input[name=username]")
        .fill(process.env.TEST_ADMIN_USERNAME || "demo");
      await p
        .locator("input[name=password]")
        .fill(process.env.TEST_ADMIN_PASSWORD);
      await p.getByRole("button", { name: "Open studio desk" }).click();
      await p
        .getByPlaceholder("Search couple, design or custom URL…")
        .waitFor();
      console.log("Admin login passed.");
    }
    console.log(
      "Favourites, search, comparison, preview modal, mobile menu, responsive layout passed.",
    );
    assert.deepEqual(errors, []);
    console.log("No browser runtime errors.");
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
