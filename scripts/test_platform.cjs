const { chromium } = require("/opt/codex/cua_node/lib/node_modules/playwright");
const { spawn } = require("child_process");
const crypto = require("crypto");
const fs = require("fs");
const key = crypto.randomBytes(32).toString("hex");
const dir = fs.mkdtempSync("/tmp/wed-test-");
const server = spawn(
  "npm",
  ["run", "dev", "--", "--hostname", "127.0.0.1", "--port", "3001"],
  {
    cwd: process.cwd(),
    env: { ...process.env, WEDINVITE_ADMIN_KEY: key, WEDINVITE_DATA_DIR: dir },
    stdio: "ignore",
    detached: true,
  },
);
(async () => {
  let browser;
  try {
    for (let i = 0; i < 60; i++) {
      try {
        await fetch("http://127.0.0.1:3001");
        break;
      } catch {
        await new Promise((r) => setTimeout(r, 500));
      }
    }
    browser = await chromium.launch({
      executablePath: "/usr/bin/chromium",
      args: ["--no-sandbox"],
    });
    const p = await browser.newPage({
      viewport: { width: 1440, height: 1000 },
    });
    await p.goto("http://127.0.0.1:3001");
    await p.screenshot({ path: "/tmp/wed-home.png", fullPage: true });
    const errors = [];
    p.on("pageerror", (e) => errors.push(e.message));
    const post = (b) =>
      p.evaluate(async (b) => {
        const r = await fetch("/api/platform", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(b),
        });
        return { status: r.status, data: await r.json() };
      }, b);
    let r = await post({ action: "approve", id: "x" });
    if (r.status !== 403) throw Error("Unprotected admin");
    r = await post({ action: "admin-login", key });
    if (r.status !== 200) throw Error(JSON.stringify(r));
    for (const t of [
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
      await p.goto("http://127.0.0.1:3001/templates/" + t);
      if (
        !(await p.locator("h1").innerText())
          .toLowerCase()
          .includes(t === "phoolpatti" ? "phool" : t)
      )
        throw Error("Product missing " + t);
      r = await post({
        action: "save",
        template: t,
        tier: "premium",
        slug: "test-" + t,
        details: {
          groom: "Zain",
          bride: "Sara",
          groomUr: "زین",
          brideUr: "سارہ",
          phone: "03001234567",
          family: "With our families",
          events: [
            {
              name: "Nikah",
              date: "2027-12-21",
              time: "18:00",
              venue: "Rose Garden",
              address: "Karachi",
            },
          ],
        },
        addons: [],
      });
      if (r.status !== 200) throw Error(JSON.stringify(r));
      const id = r.data.id;
      const anon = await browser.newContext();
      if (
        (
          await anon.request.get(
            "http://127.0.0.1:3001/api/invitation/test-" + t,
          )
        ).status() !== 403
      )
        throw Error("Private leaked");
      r = await post({ action: "approve", id });
      if (r.status !== 200) throw Error("Approve failed");
      const response = await anon.request.get(
        "http://127.0.0.1:3001/api/invitation/test-" + t,
      );
      const html = await response.text();
      if (
        !html.includes("Zain") ||
        !html.includes("Rose Garden") ||
        html.includes("Bilal")
      )
        throw Error("Personalization failed " + t);
      await p.goto("http://127.0.0.1:3001/invite/test-" + t);
      await p.waitForTimeout(250);
      await anon.close();
      console.log(
        t + ": product, personalization, payment gate and activation passed",
      );
    }
    await p.goto("http://127.0.0.1:3001/admin");
    await p.getByText("Edit invitation details ↗").first().click();
    await p.waitForTimeout(500);
    if (await p.locator('input[placeholder="bilal-and-mahrukh"]').count()) {
    }
    await p.setViewportSize({ width: 390, height: 844 });
    await p.goto("http://127.0.0.1:3001");
    await p.screenshot({ path: "/tmp/wed-mobile.png", fullPage: true });
    console.log("Browser errors:", errors);
    if (errors.length) throw Error("Browser errors");
  } finally {
    if (browser) await browser.close();
    try {
      process.kill(-server.pid, "SIGTERM");
    } catch {}
    fs.rmSync(dir, { recursive: true, force: true });
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
