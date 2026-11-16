const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const fs = require("fs");
(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    args: ["--no-sandbox"],
  });
  const results = [];
  for (const route of ["/", "/templates", "/templates/gulistan", "/order"]) {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    });
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    await cdp.send("Network.enable");
    await cdp.send("Network.emulateNetworkConditions", {
      offline: false,
      latency: 100,
      downloadThroughput: 200000,
      uploadThroughput: 93750,
    });
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await page.addInitScript(() => {
      window.__vitals = { lcp: 0, cls: 0, longTasks: 0 };
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) window.__vitals.lcp = e.startTime;
      }).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver((l) => {
        for (const e of l.getEntries())
          if (!e.hadRecentInput) window.__vitals.cls += e.value;
      }).observe({ type: "layout-shift", buffered: true });
      new PerformanceObserver((l) => {
        window.__vitals.longTasks += l.getEntries().length;
      }).observe({ type: "longtask", buffered: true });
    });
    await page.goto(
      (process.env.TEST_BASE || "http://127.0.0.1:3051") + route,
      { waitUntil: "load", timeout: 120000 },
    );
    await page.waitForTimeout(2500);
    results.push({
      route,
      ...(await page.evaluate(() => ({
        ...window.__vitals,
        transferred: performance
          .getEntriesByType("resource")
          .reduce((s, r) => s + r.transferSize, 0),
        domReady:
          performance.getEntriesByType("navigation")[0]
            .domContentLoadedEventEnd,
      }))),
    });
    await context.close();
  }
  await browser.close();
  fs.mkdirSync("artifacts/500-journeys", { recursive: true });
  fs.writeFileSync(
    "artifacts/500-journeys/mobile-performance.json",
    JSON.stringify(results, null, 2),
  );
  console.log(results);
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
