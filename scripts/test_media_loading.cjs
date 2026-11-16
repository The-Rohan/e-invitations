const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const assert = require("node:assert/strict");
const base = process.env.TEST_BASE || "http://127.0.0.1:3051";
(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    args: ["--no-sandbox"],
  });
  try {
    const p = await browser.newPage({
        viewport: { width: 390, height: 844 },
        reducedMotion: "reduce",
      }),
      requests = [],
      errors = [];
    p.on("request", (r) => requests.push(r.url()));
    p.on("pageerror", (e) => errors.push(e.message));
    await p.goto(base + "/templates/gulistan");
    await p.locator("video").waitFor();
    await p.waitForTimeout(1000);
    assert(
      !requests.some((u) => u.endsWith(".mp4")),
      "reduced motion must not download autoplay film",
    );
    assert(
      !requests.some(
        (u) =>
          u.includes("fonts.googleapis.com") || u.includes("fonts.gstatic.com"),
      ),
      "fonts should be local",
    );
    await p
      .getByRole("button", { name: "Play opening film", exact: true })
      .click();
    await p
      .getByRole("button", { name: "Pause opening film", exact: true })
      .waitFor();
    await p.waitForFunction(
      () => document.querySelector("video").readyState >= 2,
    );
    await p
      .getByRole("button", { name: "Pause opening film", exact: true })
      .click();
    await p.evaluate(() => scrollTo(0, document.body.scrollHeight));
    await p.waitForTimeout(200);
    await p.locator("video").scrollIntoViewIfNeeded();
    await p.waitForTimeout(300);
    assert(
      await p.locator("video").evaluate((v) => v.paused),
      "manual pause should persist",
    );
    for (const label of ["The invitation", "The details", "The opening"])
      await p.getByRole("button", { name: label, exact: true }).click();
    await p.locator(".wv-film-poster").waitFor();
    assert(
      await p.evaluate(async () => {
        await document.fonts.load('20px "Noto Nastaliq Urdu"', "اردو");
        return document.fonts.check('20px "Noto Nastaliq Urdu"', "اردو");
      }),
    );
    await p.emulateMedia({ reducedMotion: "no-preference" });
    await p.goto(base + "/templates/baradari");
    await p
      .getByRole("button", { name: "Pause opening film", exact: true })
      .waitFor();
    await p
      .getByRole("button", { name: "Pause opening film", exact: true })
      .click();
    await p.evaluate(() => scrollTo(0, document.body.scrollHeight));
    await p.waitForTimeout(200);
    await p.locator("video").scrollIntoViewIfNeeded();
    await p.waitForTimeout(300);
    assert(await p.locator("video").evaluate((v) => v.paused));
    assert.deepEqual(errors, []);
    console.log(
      "PASS local Urdu font, deferred media, reduced motion, autoplay, manual play/pause persistence, product view switching and no browser errors",
    );
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
