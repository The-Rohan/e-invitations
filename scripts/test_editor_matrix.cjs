const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const { spawn } = require("node:child_process"),
  fs = require("node:fs"),
  crypto = require("node:crypto"),
  assert = require("node:assert/strict");
const manifest = require("../lib/template-manifest.json"),
  base = "http://127.0.0.1:3056",
  dir = fs.mkdtempSync("/tmp/wed-editor-matrix-"),
  password = crypto.randomBytes(24).toString("hex"),
  out = "artifacts/editor-matrix";
fs.mkdirSync(out, { recursive: true });
const server = spawn(
  process.execPath,
  [
    "node_modules/next/dist/bin/next",
    "start",
    "--hostname",
    "127.0.0.1",
    "--port",
    "3056",
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
const results = [],
  errors = [];
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
    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
      reducedMotion: "reduce",
    });
    const headers = async () => ({
      Origin: base,
      Cookie: (await ctx.cookies())
        .map((c) => c.name + "=" + c.value)
        .join("; "),
    });
    const post = async (data) => {
      const r = await ctx.request.post(base + "/api/platform", {
        headers: await headers(),
        data,
      });
      assert.equal(r.status(), 200, await r.text());
      return r.json();
    };
    await post({ action: "admin-login", username: "qa", password });
    for (const [template, m] of Object.entries(manifest)) {
      const page = await ctx.newPage();
      await page.route("https://editor.example.test/**", (r) =>
        r.fulfill({
          contentType: "image/svg+xml",
          body: '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600"><rect width="400" height="600" fill="#abc"/></svg>',
        }),
      );
      page.setDefaultTimeout(15000);
      page.on("pageerror", (e) => errors.push({ template, error: e.message }));
      const result = {
        template,
        fields: 0,
        renderIssues: [],
        searchIssues: [],
      };
      try {
        const details = {
          groom: "QA Groom",
          bride: "QA Bride",
          phone: "03001234567",
          welcome: "QA welcome",
          travel: "QA travel",
          accommodation: "QA accommodation",
          events: ["Mehndi", "Barat", "Walima"].map((name, i) => ({
            id: "event-" + i,
            name,
            date: "2028-05-" + (20 + i),
            time: "19:00",
            venue: "QA Hall",
            address: "Karachi",
            dressCode: "QA festive",
            schedule: [{ time: "20:00", title: "Dinner" }],
          })),
        };
        const { id } = await post({
          action: "save",
          template,
          tier: "full",
          slug: "editor-" + template,
          details,
          addons: [],
        });
        await page.goto(base + "/admin/create?order=" + id);
        await page
          .getByRole("button", { name: "4. Review & save", exact: true })
          .click();
        await page.getByText(/^Design wording ·/).click();
        for (const summary of await page
          .locator(".template-copy-group>summary")
          .all())
          await summary.click();
        const fields = m.fields.filter((f) => !f.managed),
          groups = [...new Set(fields.map((f) => f.group))],
          ordered = groups.flatMap((g) => fields.filter((f) => f.group === g));
        assert.equal(
          await page.locator(".template-copy-pair").count(),
          fields.length,
        );
        const expected = {};
        for (const [i, f] of ordered.entries()) {
          const pair = page.locator(".template-copy-pair").nth(i),
            en = "QA " + template + " " + f.key + " & <love>\nSecond line",
            ur = "محبت " + template + " " + f.key;
          await pair.locator("textarea").nth(0).fill(en);
          await pair.locator("textarea").nth(1).fill(ur);
          expected[f.key] = { en, ur };
          result.fields++;
        }
        const firstPair = page.locator(".template-copy-pair").first();
        await firstPair
          .getByRole("button", { name: "Reset this text", exact: true })
          .click();
        assert.equal(
          await firstPair.locator("textarea").nth(0).inputValue(),
          ordered[0].en,
        );
        await firstPair
          .locator("textarea")
          .nth(0)
          .fill(expected[ordered[0].key].en);
        await firstPair
          .locator("textarea")
          .nth(1)
          .fill(expected[ordered[0].key].ur);
        assert(
          await page.evaluate(() => {
            const e = new Event("beforeunload", { cancelable: true });
            window.dispatchEvent(e);
            return e.defaultPrevented;
          }),
          "unsaved refresh guard",
        );
        let leaveWarning = false;
        page.once("dialog", async (d) => {
          leaveWarning = d.type() === "confirm";
          await d.dismiss();
        });
        await page.locator('a[href="/"]').first().click();
        assert(leaveWarning, "leaving editor warns about unsaved changes");
        assert(page.url().includes("/admin/create"));

        await page.getByLabel("Find wording", { exact: true }).fill("محبت");
        if (
          (await page.locator(".template-copy-pair").count()) !== fields.length
        )
          result.searchIssues.push("Cannot find customized Urdu text");
        await page.getByLabel("Find wording", { exact: true }).fill("");
        await page
          .getByLabel("Find wording", { exact: true })
          .fill("no-match-xyz");
        await page
          .getByText(
            "No matching wording. Try another word or clear the search.",
            { exact: true },
          )
          .waitFor();
        await page
          .getByLabel("Find wording", { exact: true })
          .fill(ordered[0].key);
        assert(
          await page.locator(".template-copy-pair").first().isVisible(),
          "search reveals matching controls",
        );
        await page.getByLabel("Find wording", { exact: true }).fill("");
        await page.getByLabel("Opening language").selectOption("ur");
        await page
          .getByLabel("Main date reveal & countdown")
          .selectOption("event-1");
        await page
          .getByText("Family wording & guest information", { exact: true })
          .click();
        for (const label of [
          "Family message in Urdu",
          "Welcome message",
          "Welcome message in Urdu",
          "Transport, parking & directions",
          "Travel information in Urdu",
          "Accommodation details",
          "Accommodation details in Urdu",
          "Hotel / guest house",
          "Accommodation address",
        ])
          await page
            .getByLabel(label, { exact: true })
            .fill("QA edited " + label);
        await page
          .getByLabel("Accommodation map", { exact: true })
          .fill("https://maps.google.com/?q=QA");
        await page
          .getByText("Sections offered by this design", { exact: true })
          .click();
        for (const checkbox of await page
          .locator(".template-section-grid input")
          .all()) {
          await checkbox.uncheck();
          await checkbox.check();
        }
        await page.getByText("Custom illustrations", { exact: true }).click();
        const imageLabels = [
          "Opening still",
          ...(template === "khat"
            ? []
            : ["Venue illustration", "Dress illustration"]),
          ...(m.sections.some((s) => s.kind === "stay") && template !== "khat"
            ? ["Accommodation illustration"]
            : []),
        ];
        for (const label of imageLabels)
          await page
            .getByLabel(label, { exact: true })
            .fill("https://editor.example.test/art.svg");
        await page.getByLabel("Text size").selectOption("large");
        await page.getByLabel("Enable invitation music").uncheck();
        await page
          .getByLabel("Custom music URL")
          .fill("https://editor.example.test/music.mp3");
        await page.getByLabel("RSVP deadline").fill("2028-05-01");
        await page.getByLabel("Collect guest replies").uncheck();
        await page.getByLabel("Collect guest replies").check();
        await page
          .getByLabel("I’ve checked the names, dates and venues.")
          .check();
        await page
          .getByRole("button", {
            name: "Save invitation changes ↗",
            exact: true,
          })
          .click();
        await page.waitForURL(base + "/admin");
        const state = await (
          await ctx.request.get(base + "/api/platform", {
            headers: await headers(),
          })
        ).json();
        assert.deepEqual(
          state.orders.find((o) => o.id === id).details.templateOptions[
            template
          ].copy,
          expected,
          "All wording saved",
        );
        const saved = state.orders.find((o) => o.id === id);
        assert.equal(saved.details.primaryEventId, "event-1");
        assert.equal(saved.details.rsvpDeadline, "2028-05-01");
        assert.equal(saved.details.rsvpEnabled, true);
        assert.equal(saved.details.welcome, "QA edited Welcome message");
        assert.equal(saved.details.templateOptions[template].language, "ur");
        assert.equal(saved.details.templateOptions[template].textSize, "large");
        assert.equal(saved.details.templateOptions[template].music, false);
        assert.equal(
          saved.details.templateOptions[template].musicUrl,
          "https://editor.example.test/music.mp3",
        );
        assert.deepEqual(
          saved.details.templateOptions[template].hiddenSections,
          [],
        );
        assert.equal(
          Object.keys(saved.details.templateOptions[template].images).length,
          imageLabels.length,
        );

        await page.goto(base + "/admin/create?order=" + id);
        await page
          .getByRole("button", { name: "4. Review & save", exact: true })
          .click();
        await page.getByText(/^Design wording ·/).click();
        for (const summary of await page
          .locator(".template-copy-group>summary")
          .all())
          await summary.click();
        for (const [i, f] of ordered.entries()) {
          const pair = page.locator(".template-copy-pair").nth(i);
          assert.equal(
            await pair.locator("textarea").nth(0).inputValue(),
            expected[f.key].en,
          );
          assert.equal(
            await pair.locator("textarea").nth(1).inputValue(),
            expected[f.key].ur,
          );
        }
        await page.setViewportSize({ width: 390, height: 844 });
        assert(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth + 1,
          ),
          "mobile editor overflow",
        );
        await page
          .locator(".template-copy-pair")
          .first()
          .scrollIntoViewIfNeeded();
        await page.screenshot({ path: out + "/" + template + "-editor.png" });
        await page.goto(base + "/api/invitation/" + id);
        await page.waitForFunction(() => window.WI);
        await page.waitForTimeout(200);
        await page.evaluate(() => {
          if (typeof setLang === "function") setLang("ur");
        });
        const findings = await page.evaluate(
          (expected) =>
            Object.entries(expected).flatMap(([key, value]) => {
              const el = document.querySelector('[data-wi-copy="' + key + '"]');
              if (!el) return [{ key, reason: "missing node" }];
              const decode = (html) => {
                const t = document.createElement("div");
                t.innerHTML = html || "";
                return t.textContent;
              };
              return decode(el.dataset.en).includes(value.en.split("\n")[0]) &&
                decode(el.dataset.ur).includes(value.ur) &&
                el.textContent.includes(value.ur)
                ? []
                : [
                    {
                      key,
                      reason: "custom wording overwritten",
                      actual: el.dataset.en,
                    },
                  ];
            }),
          expected,
        );
        result.renderIssues = findings;
        result.ok = !findings.length && !result.searchIssues.length;
      } catch (e) {
        result.error = e.message;
        result.ok = false;
      } finally {
        results.push(result);
        await page.close();
        console.log(JSON.stringify(result));
        fs.writeFileSync(
          out + "/report.json",
          JSON.stringify({ results, errors }, null, 2),
        );
      }
    }
    if (results.some((r) => !r.ok) || errors.length) process.exitCode = 1;
  } finally {
    await browser?.close();
    server.kill();
    fs.rmSync(dir, { recursive: true, force: true });
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
