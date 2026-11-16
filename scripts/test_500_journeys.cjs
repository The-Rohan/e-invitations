const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const { spawn } = require("node:child_process"),
  fs = require("node:fs"),
  crypto = require("node:crypto"),
  assert = require("node:assert/strict");
const count = Number(process.env.JOURNEYS || 500),
  workers = Number(process.env.WORKERS || 8),
  base = "http://127.0.0.1:3050",
  dir = fs.mkdtempSync("/tmp/wed-500-"),
  out = "artifacts/500-journeys";
fs.mkdirSync(out, { recursive: true });
const apiTimes = [];
const password = crypto.randomBytes(24).toString("hex"),
  results = [],
  requests = [],
  browserErrors = [],
  load = [];
let browser,
  cookie = "",
  next = 0;
const server = spawn(
  process.execPath,
  [
    "node_modules/next/dist/bin/next",
    "start",
    "--hostname",
    "127.0.0.1",
    "--port",
    "3050",
  ],
  {
    env: {
      ...process.env,
      WEDINVITE_DATA_DIR: dir,
      WEDINVITE_ADMIN_USERNAME: "qa",
      WEDINVITE_ADMIN_KEY: password,
    },
    stdio: [
      "ignore",
      fs.openSync(out + "/server.log", "w"),
      fs.openSync(out + "/server-errors.log", "w"),
    ],
  },
);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function post(body, path = "/api/platform", extra = {}) {
  const started = performance.now();
  const response = await fetch(base + path, {
    method: "POST",
    headers: {
      Origin: base,
      "Content-Type": "application/json",
      Cookie: cookie,
      ...extra,
    },
    body: JSON.stringify(body),
  });
  apiTimes.push({
    path,
    ms: performance.now() - started,
    status: response.status,
  });
  return response;
}
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
const stat = (xs) => {
  const a = xs.slice().sort((a, b) => a - b);
  return {
    n: a.length,
    p50: Math.round(a[Math.floor(a.length * 0.5)] || 0),
    p95: Math.round(a[Math.floor(a.length * 0.95)] || 0),
    max: Math.round(a.at(-1) || 0),
  };
};
(async () => {
  try {
    for (let i = 0; i < 100; i++) {
      try {
        if ((await fetch(base + "/api/platform")).ok) break;
      } catch {}
      await sleep(200);
    }
    let r = await post({ action: "admin-login", username: "qa", password });
    assert.equal(r.status, 200);
    cookie = r.headers.get("set-cookie").split(";")[0];
    r = await post({
      action: "save",
      template: "baradari",
      tier: "full",
      addons: [],
      slug: "qa-load-invite",
      details: {
        groom: "QA Groom",
        bride: "QA Bride",
        phone: "03001234567",
        events: ["Mehndi", "Barat", "Walima"].map((name, i) => ({
          id: "event-" + i,
          name,
          date: "2028-06-" + (20 + i),
          time: "19:00",
          venue: "QA Garden",
          address: "Karachi",
        })),
      },
    });
    assert.equal(r.status, 200);
    const { id } = await r.json();
    assert.equal((await post({ action: "approve", id })).status, 200);
    browser = await chromium.launch({
      executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
      args: ["--no-sandbox"],
    });
    async function journey(i) {
      const started = performance.now(),
        width = [320, 390, 768, 1440, 1920][i % 5],
        kind = Math.floor(i / 5) % 5,
        design = ids[Math.floor(i / 25) % 10];
      const ctx = await browser.newContext({
          viewport: { width, height: 900 },
          isMobile: width < 500,
          hasTouch: width < 500,
          reducedMotion: i % 7 === 0 ? "reduce" : "no-preference",
        }),
        p = await ctx.newPage();
      p.setDefaultTimeout(18000);
      p.on("pageerror", (e) => browserErrors.push({ i, message: e.message }));
      p.on("response", (r) => {
        if (r.url().startsWith(base) && r.status() >= 500)
          browserErrors.push({ i, message: r.status() + " " + r.url() });
      });
      const goto = async (path) => {
        const t = performance.now();
        await p.goto(base + path, { waitUntil: "domcontentloaded" });
        requests.push({ path, ms: performance.now() - t });
      };
      try {
        if (kind === 0) {
          await goto("/");
          if (width <= 768) {
            await p
              .getByRole("button", { name: "Open menu", exact: true })
              .click();
            await p
              .getByRole("navigation", {
                name: "Mobile navigation",
                exact: true,
              })
              .getByRole("link", { name: "Our packages", exact: true })
              .click();
          } else
            await p
              .getByRole("navigation", { name: "Main navigation", exact: true })
              .getByRole("link", { name: "Our packages", exact: true })
              .click();
          await p.waitForURL("**/#packages");
          if (i % 2 === 0) {
            await p.evaluate(() =>
              Object.defineProperty(navigator, "clipboard", {
                configurable: true,
                value: {
                  writeText: () =>
                    Promise.reject(new Error("Permission denied")),
                },
              }),
            );
            await p
              .getByRole("button", { name: "Copy sample invitation link" })
              .click();
            assert(
              (
                await p
                  .getByRole("textbox", {
                    name: "Sample invitation link",
                    exact: true,
                  })
                  .inputValue()
              ).endsWith("/preview/gulistan"),
            );
          }
          await p.locator(".wv-faq summary").first().click();
          assert(
            await p
              .locator(".wv-faq details")
              .first()
              .evaluate((e) => e.open),
          );
        }
        if (kind === 1) {
          await goto("/templates");
          await p
            .getByRole("button", { name: "Save Gulistan", exact: true })
            .click();
          await p
            .getByRole("button", { name: "Saved (1)", exact: true })
            .click();
          assert.equal(await p.locator(".wv-design-card").count(), 1);
          await p
            .getByRole("button", { name: "All designs", exact: true })
            .click();
          await p
            .getByRole("textbox", { name: "Search designs" })
            .fill("midnight");
          assert.equal(await p.locator(".wv-design-card").count(), 1);
          await p.getByRole("button", { name: "Clear search" }).click();
          await p.locator(".wv-design-card input").nth(0).check();
          await p.locator(".wv-design-card input").nth(1).check();
          await p
            .getByRole("button", { name: "Compare designs", exact: true })
            .click();
          await p.getByRole("dialog").waitFor();
          await p.keyboard.press("Escape");
          await p.reload();
          await p
            .getByRole("button", { name: "Saved (1)", exact: true })
            .waitFor();
        }
        if (kind === 2) {
          await goto("/templates/" + design);
          for (const name of ["The details", "The invitation", "The opening"])
            await p.getByRole("button", { name, exact: true }).click();
          await p.getByRole("radio", { name: /The complete suite/ }).click();
          await p.locator(".at-offer-picker>.at-primary").click();
          await p.waitForURL((u) => u.pathname === "/order");
          await p.locator("#customer-name").fill("QA Product " + i);
          await p.locator("#customer-phone").fill("03001234567");
          await p.getByRole("button", { name: /Choose my invitation/ }).click();
          await p.locator(".order-designs").waitFor();
          assert(
            (
              await p
                .locator(".order-designs article.selected img")
                .getAttribute("src")
            ).includes(design),
          );
        }
        if (kind === 3) {
          await goto("/order?template=" + design + "&tier=full");
          await p.getByRole("button", { name: /Choose my invitation/ }).click();
          assert.equal(await p.locator("#customer-name").count(), 1);
          await p.locator("#customer-name").fill("QA Journey " + i);
          await p.locator("#customer-phone").fill("03001234567");
          await p.getByRole("button", { name: /Choose my invitation/ }).click();
          await p.getByRole("button", { name: /Continue to payment/ }).click();
          await p.getByRole("checkbox").check();
          await p
            .getByRole("button", { name: /Continue to WhatsApp details/ })
            .click();
          await p.getByText("All changes saved", { exact: true }).waitFor();
          assert(
            (
              await p
                .getByRole("link", { name: /Continue on WhatsApp/ })
                .getAttribute("href")
            ).startsWith("https://wa.me/"),
          );
          await p.reload();
          await p.getByRole("link", { name: /Continue on WhatsApp/ }).waitFor();
        }
        if (kind === 4) {
          await goto("/invite/qa-load-invite?event=event-" + (i % 3));
          await p
            .getByRole("button", { name: "Reply with love ♡", exact: true })
            .click();
          await p
            .getByLabel("Your name", { exact: true })
            .fill("QA Browser " + i);
          await p.getByLabel("Number of guests").fill(String((i % 4) + 1));
          if (i % 3 === 0) await p.getByLabel("Your reply").selectOption("no");
          await p
            .getByRole("button", { name: "Send my reply ♡", exact: true })
            .click();
          await p
            .getByText("Thank you. Your reply has reached the couple.", {
              exact: true,
            })
            .waitFor();
        }
        assert(
          await p.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth + 1,
          ),
          "horizontal overflow",
        );
        results.push({
          i,
          kind,
          width,
          design,
          ok: true,
          ms: performance.now() - started,
        });
      } catch (e) {
        console.log("FAIL", i, e.message);
        results.push({
          i,
          kind,
          width,
          design,
          ok: false,
          error: e.message,
          ms: performance.now() - started,
        });
        if (results.filter((r) => !r.ok).length <= 12)
          await p
            .screenshot({ path: out + "/failure-" + i + ".png" })
            .catch(() => {});
      } finally {
        await ctx.close();
      }
    }
    await Promise.all(
      Array.from({ length: workers }, async () => {
        while (next < count) {
          const i = next++;
          await journey(i);
          if (results.length % 25 === 0) {
            console.log(
              "Journeys",
              results.length,
              "failures",
              results.filter((r) => !r.ok).length,
            );
            fs.writeFileSync(
              out + "/browser-progress.json",
              JSON.stringify(results, null, 2),
            );
          }
        }
      }),
    );
    // 500 independent users start writes together; follow each user's own revision sequence.
    await Promise.all(
      Array.from({ length: 500 }, async (_, i) => {
        const token = crypto.randomBytes(32).toString("hex"),
          t = performance.now();
        try {
          const data = {
            name: "QA Load " + i,
            phone: "03001234567",
            email: "",
            template: ids[i % 10],
            tier: "full",
            addons: [],
            paymentMethod: "Easypaisa",
            paymentClaimed: false,
            transaction: "",
            step: 0,
            whatsappOpened: false,
          };
          for (let revision = 1; revision <= 3; revision++) {
            data.step = revision - 1;
            const r = await post({ revision, data }, "/api/leads", {
              Authorization: "Bearer " + token,
            });
            assert.equal(r.status, 200);
            await sleep((i % 7) * 20);
          }
          const reply = {
            action: "rsvp",
            id,
            name: "QA Load Guest " + i,
            count: 1,
            attending: true,
            requestId: "load-request-" + i,
          };
          assert.equal((await post(reply)).status, 200);
          assert.equal((await post(reply)).status, 200);
          load.push({ i, ok: true, ms: performance.now() - t });
        } catch (e) {
          load.push({
            i,
            ok: false,
            error: e.message,
            ms: performance.now() - t,
          });
        }
      }),
    );
    const db = JSON.parse(fs.readFileSync(dir + "/platform.json"));
    assert.equal(
      db.leads.filter((l) => l.name.startsWith("QA Load ")).length,
      500,
    );
    assert.equal(
      db.rsvps.filter((r) => r.name.startsWith("QA Load Guest ")).length,
      500,
    );
    const report = {
      browserJourneys: results,
      loadJourneys: load,
      browserErrors,
      navigation: stat(requests.map((r) => r.ms)),
      browserDuration: stat(results.map((r) => r.ms)),
      loadDuration: stat(load.map((r) => r.ms)),
      records: { leads: db.leads.length, rsvps: db.rsvps.length },
      workers,
      apiLatency: stat(apiTimes.map((r) => r.ms)),
    };
    fs.writeFileSync(out + "/report.json", JSON.stringify(report, null, 2));
    console.log(
      JSON.stringify({
        completed: results.length,
        failed: results.filter((r) => !r.ok).length,
        loadFailed: load.filter((r) => !r.ok).length,
        browserErrors: browserErrors.length,
        navigation: report.navigation,
        load: report.loadDuration,
        records: report.records,
        apiLatency: report.apiLatency,
      }),
    );
    if (
      results.some((r) => !r.ok) ||
      load.some((r) => !r.ok) ||
      browserErrors.length
    )
      process.exitCode = 1;
  } finally {
    fs.writeFileSync(
      out + "/browser-progress.json",
      JSON.stringify(results, null, 2),
    );
    if (browser) await browser.close();
    server.kill();
    fs.rmSync(dir, { recursive: true, force: true });
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
