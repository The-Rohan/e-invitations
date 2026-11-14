const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const { spawn } = require("node:child_process");
const fs = require("node:fs"),
  assert = require("node:assert/strict"),
  crypto = require("node:crypto");
const manifest = require("../lib/template-manifest.json");
const base = "http://127.0.0.1:3020",
  dir = fs.mkdtempSync("/tmp/wed-suite-"),
  password = crypto.randomBytes(20).toString("hex");
const out = "artifacts/template-suite";
fs.mkdirSync(out, { recursive: true });
const server = spawn(
  process.execPath,
  [
    "node_modules/next/dist/bin/next",
    "start",
    "--hostname",
    "127.0.0.1",
    "--port",
    "3020",
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
let browser, page;
const errors = [],
  results = [];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  try {
    for (let i = 0; i < 80; i++) {
      try {
        if ((await fetch(base + "/api/platform")).ok) break;
      } catch {}
      await sleep(250);
    }
    browser = await chromium.launch({
      executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
      args: ["--no-sandbox"],
    });
    const admin = await browser.newContext({
        viewport: { width: 1440, height: 950 },
        reducedMotion: "reduce",
        permissions: ["clipboard-read", "clipboard-write"],
      }),
      guest = await browser.newContext();
    const post = async (ctx, body, url = "/api/platform") =>
      ctx.request.post(base + url, {
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
        await post(admin, { action: "admin-login", username: "qa", password })
      ).status(),
      200,
    );
    assert.equal((await post(guest, {}, "/api/studio-preview")).status(), 403);
    const events = ["Mehndi", "Barat", "Walima"].map((name, i) => ({
      id: ["mehndi-id", "barat-id", "walima-id"][i],
      name,
      nameUr: ["مہندی", "بارات", "ولیمہ"][i],
      date: `2028-04-${20 + i}`,
      time: ["18:00", "19:00", "20:00"][i],
      endDate: `2028-04-${20 + i}`,
      endTime: ["22:00", "23:00", "23:30"][i],
      venue: ["QA Garden & Hall", "QA Palace <Court>", "QA Reception"][i],
      venueUr: ["باغ", "محل", "استقبالیہ"][i],
      address: "QA Karachi " + i,
      addressUr: "کراچی " + i,
      mapUrl: "https://www.google.com/maps/search/?api=1&query=QA-" + i,
      description: "Join us for " + name,
      descriptionUr: "خوش آمدید " + name,
      dressCode: ["Yellow & green", "Formal red", "Ivory & gold"][i],
      dressCodeUr: "روایتی لباس",
      separateSeating: i === 1,
      art: ["mehndi", "baraat", "walima"][i],
      colors: ["#112233", "#445566", "#778899"],
      schedule: [{ time: "20:00", title: name + " dinner", titleUr: "کھانا" }],
    }));
    const details = {
      groom: "Zain & <Ali>",
      bride: "Sara O’Neil",
      groomUr: "زین <علی> & رضا",
      brideUr: "سارہ",
      family: "The QA families",
      familyUr: "اہل خانہ",
      phone: "03001234567",
      primaryEventId: "barat-id",
      welcome: "Welcome to our celebrations",
      welcomeUr: "خوش آمدید",
      travel: "Parking at the east gate.",
      travelUr: "مشرقی دروازہ",
      accommodation: "Contact our family for room arrangements.",
      accommodationUr: "قیام کے لیے رابطہ کریں",
      accommodationName: "QA Guest House",
      accommodationAddress: "QA Karachi",
      accommodationMap:
        "https://www.google.com/maps/search/?api=1&query=QA-Hotel",
      rsvpDeadline: "2028-04-01",
      events,
    };
    let firstOrder;
    for (const template of Object.keys(manifest).filter(
      (t) => !process.env.TEMPLATE_FILTER || t === process.env.TEMPLATE_FILTER,
    )) {
      const copyField = manifest[template].fields.find(
        (f) => !f.managed && f.group === "hero" && /Kick/.test(f.className),
      );
      const d = structuredClone(details);
      d.templateOptions = {
        [template]: {
          music: false,
          images: {
            hero: "https://media.example.test/hero.webp",
            venue: "https://media.example.test/venue.webp",
            dress: "https://media.example.test/dress.webp",
            ...(manifest[template].sections.some((s) => s.kind === "stay")
              ? { stay: "https://media.example.test/stay.webp" }
              : {}),
          },
          copy: {
            [copyField.key]: {
              en: "A celebration <with> love & joy",
              ur: "محبت کی تقریب",
            },
          },
        },
      };
      if (template === "khat") {
        delete d.templateOptions[template].images.venue;
        delete d.templateOptions[template].images.dress;
        delete d.templateOptions[template].images.stay;
      }
      const saved = await post(admin, {
        action: "save",
        suiteVersion: 2,
        template,
        tier: "full",
        slug: "suite-" + template,
        addons: [],
        details: d,
      });
      assert.equal(saved.status(), 200, await saved.text());
      const { id } = await saved.json();
      if (!firstOrder) firstOrder = { id, template, details: d };
      assert.equal(
        (
          await guest.request.get(
            base + "/api/invitation/" + id + "?event=walima-id",
          )
        ).status(),
        403,
      );
      assert.equal(
        (await post(admin, { action: "approve", id })).status(),
        200,
      );
      assert.equal(
        (
          await post(admin, { action: "fulfillment", id, fulfillment: "ready" })
        ).status(),
        400,
      );
      assert.equal(
        (
          await guest.request.get(
            base + "/api/invitation/" + id + "?event=not-real",
          )
        ).status(),
        404,
      );
      for (const scope of ["", ...events.map((e) => e.id)]) {
        page = await admin.newPage();
        await page.route("https://media.example.test/**", (route) =>
          route.fulfill({
            contentType: "image/svg+xml",
            body: '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600"><rect width="400" height="600" fill="#ccd6ce"/></svg>',
          }),
        );
        page.setDefaultTimeout(10000);
        page.on("pageerror", (e) =>
          errors.push({ template, scope, message: e.message }),
        );
        const response = await page.goto(
          base + "/api/invitation/" + id + (scope ? "?event=" + scope : ""),
        );
        assert.equal(response.status(), 200, await response.text());
        await page
          .locator("#evGrid>.ev,#eventPath>.evCard")
          .first()
          .waitFor({ state: "attached" });
        const expected = scope ? events.filter((e) => e.id === scope) : events,
          primary = scope ? expected[0] : events[1];
        assert.equal(
          await page.locator("#evGrid>.ev,#eventPath>.evCard").count(),
          expected.length,
        );
        assert.equal(
          await page.evaluate(() => window.WI.primary.key),
          primary.id,
        );
        assert.equal(
          (
            await page
              .locator('[data-wi-copy="' + copyField.key + '"]')
              .textContent()
          ).trim(),
          "A celebration <with> love & joy",
        );
        assert.equal(await page.locator("with").count(), 0);
        assert(
          (await page.locator(".heroNames").textContent()).replaceAll("\u00a0", " ").includes(d.groom),
        );
        if(await page.locator('.gateMonogram').count())assert.equal((await page.locator('.gateMonogram').textContent()).trim(),'ZS');
        for (const [slot, url] of Object.entries(
          d.templateOptions[template].images,
        ))
          assert(
            await page.evaluate(
              (url) =>
                Array.from(document.querySelectorAll("img,[style]")).some(
                  (el) =>
                    el.src === url || el.style.backgroundImage.includes(url),
                ),
              url,
            ),
            template + " " + slot + " illustration binding",
          );
        if (manifest[template].sections.some((s) => s.kind === "stay"))
          assert.equal(
            await page
              .locator('a[href="' + details.accommodationMap + '"]')
              .count(),
            1,
            template + " accommodation map",
          );
        await page.locator("#entrance").click({ force: true });
        await page.evaluate(() =>
          document
            .querySelectorAll("video")
            .forEach((v) => v.dispatchEvent(new Event("ended"))),
        );
        await page.locator("body:not(.locked)").waitFor();
        const cards = page.locator("#evGrid>.ev,#eventPath>.evCard");
        for (let i = 0; i < expected.length; i++) {
          const card = cards.nth(i),
            e = expected[i];
          const text = (await card.textContent()).toLowerCase();
          assert(
            text.includes(e.name.toLowerCase()) &&
              text.includes(e.venue.toLowerCase()),
            template + " event data",
          );
          assert.equal(
            await card
              .locator('a[href*="google.com/maps"]')
              .getAttribute("href"),
            e.mapUrl,
          );
          const gcal = new URL(
            await card
              .locator('a[href*="calendar.google.com"]')
              .getAttribute("href"),
          );
          assert.equal(
            gcal.searchParams.get("text"),
            e.name + " — " + d.groom + " & " + d.bride,
          );
          assert(
            gcal.searchParams
              .get("dates")
              .startsWith(e.date.replaceAll("-", "")),
          );
          const ics = decodeURIComponent(
            (await card.locator("a[download]").getAttribute("href"))
              .split(",")
              .slice(1)
              .join(","),
          );
          assert(ics.includes("UID:" + id + "-" + e.id + "@wedinvite.pk"));
          assert(
            ics.includes(
              "LOCATION:" + e.venue.replaceAll(",", "\\,") + "\\, " + e.address,
            ),
          );
          assert(ics.includes("DTEND:"));
          await card.locator(".caltoggle").click();
          await card.locator(".calpop.on").waitFor();
        }
        if (!scope) {
          if (template === "gulistan") {
            for (const tile of await page.locator("#discs canvas").all())
              await tile.click();
            await page.locator("#revDone.on").waitFor();
          } else if (
            ["androon", "riwaj", "safar", "phoolpatti"].includes(template)
          ) {
            for (const tile of await page.locator(".sealTile").all())
              await tile.click();
            await page.locator("#revDone.on").waitFor();
          } else {
            const selector = {
              baradari: "#keyTag",
              basant: ".kiteBtn",
              shabistan: ".lanternBtn",
              charkha: "#wheelBtn",
              khat: "#sealBtn",
            }[template];
            if (template === "charkha") {
              for (let i = 0; i < 3; i++) await page.locator(selector).click();
            } else
              for (const tile of await page.locator(selector).all())
                await tile.click();
            await page.locator("#lockStage.unlocked").waitFor();
            assert((await page.locator("#dateBig").innerText()).includes("21"));
          }
        }
        const visible = await page.locator("body").innerText();
        assert(
          !/Abbasi|Kiyani|Banjosa|Rawalakot|Safar Station|Chinar Haveli|2027|15 April/.test(
            visible,
          ),
          template +
            " contains sample content: " +
            visible.match(
              /.{0,30}(?:Abbasi|Kiyani|Banjosa|Rawalakot|Safar Station|Chinar Haveli|2027|15 April).{0,30}/g,
            ),
        );
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.locator("#langFab").click();
        assert.equal(await page.locator("html").getAttribute("lang"), "ur");
        assert.equal(
          (
            await page
              .locator('[data-wi-copy="' + copyField.key + '"]')
              .textContent()
          ).trim(),
          "محبت کی تقریب",
        );
        assert((await cards.first().innerText()).includes(expected[0].nameUr));
        assert(
          (await page.locator(".heroNames").textContent()).includes(d.groomUr),
          template + " safe Urdu identity",
        );
        for (const width of [1440, 390, 320]) {
          await page.setViewportSize({ width, height: 950 });
          assert(
            await page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth + 1,
            ),
            template + " overflow " + width,
          );
        }
        if (!scope) {
          await page.screenshot({
            path: out + "/" + template + "-mobile.png",
            fullPage: true,
          });
        }
        assert.equal(errors.length, 0, JSON.stringify(errors));
        await page.close();
        page = null;
        assert.equal(
          (
            await post(admin, {
              action: "review-deliverable",
              id,
              revision: 1,
              version: scope || "combined",
            })
          ).status(),
          200,
        );
        results.push(template + ": " + (scope || "combined"));
        console.log("PASS " + results.at(-1));
      }
      assert.equal(
        (
          await post(admin, { action: "fulfillment", id, fulfillment: "ready" })
        ).status(),
        200,
      );
    }
    const o = firstOrder;
    // RSVP event boundaries are server-enforced, including guesses and stale/deleted event IDs.
    assert.equal(
      (
        await post(guest, {
          action: "rsvp",
          id: o.id,
          eventId: "mehndi-id",
          eventIds: ["walima-id"],
          name: "QA Guest",
          count: 2,
          attending: true,
        })
      ).status(),
      400,
    );
    const reply = {
      action: "rsvp",
      id: o.id,
      eventId: "mehndi-id",
      eventIds: ["mehndi-id"],
      name: "QA Scoped Guest",
      count: 2,
      attending: true,
      requestId: "suite-rsvp-unique",
    };
    assert.equal((await post(guest, reply)).status(), 200);
    assert.equal((await post(guest, reply)).status(), 200);
    const state = await (
      await admin.request.get(base + "/api/platform", {
        headers: {
          Cookie: (await admin.cookies())
            .map((c) => c.name + "=" + c.value)
            .join("; "),
        },
      })
    ).json();
    const r = state.rsvps.filter((x) => x.name === "QA Scoped Guest");
    assert.equal(r.length, 1);
    assert.equal(r[0].responses.length, 1);
    assert.equal(r[0].responses[0].eventId, "mehndi-id");
    // Editing invalidates delivery checks; reordering keeps old event links correctly scoped.
    const changed = structuredClone(o.details);
    changed.events.reverse();
    changed.events.find((e) => e.id === "mehndi-id").name = "Mehndi renamed";
    assert.equal(
      (
        await post(admin, {
          action: "save",
          id: o.id,
          suiteVersion: 2,
          template: o.template,
          tier: "full",
          slug: "suite-" + o.template,
          addons: [],
          details: changed,
        })
      ).status(),
      200,
    );
    assert.equal(
      (
        await post(admin, {
          action: "review-deliverable",
          id: o.id,
          revision: 1,
          version: "combined",
        })
      ).status(),
      409,
    );
    assert.equal(
      (
        await post(admin, {
          action: "fulfillment",
          id: o.id,
          fulfillment: "ready",
        })
      ).status(),
      400,
    );
    const meta = await (
      await guest.request.get(
        base + "/api/invitation/" + o.id + "?event=mehndi-id&format=meta",
      )
    ).json();
    assert.equal(meta.events[0].name, "Mehndi renamed");
    const bad = structuredClone(changed);
    bad.events[0].mapUrl = "javascript:alert(1)";
    assert.equal(
      (
        await post(admin, {
          action: "save",
          id: o.id,
          template: o.template,
          tier: "full",
          slug: "suite-" + o.template,
          addons: [],
          details: bad,
        })
      ).status(),
      400,
    );
    assert.equal(
      (
        await post(admin, {
          action: "save",
          id: o.id,
          contentRevision: 1,
          template: o.template,
          tier: "full",
          slug: "suite-" + o.template,
          addons: [],
          details: changed,
        })
      ).status(),
      409,
    );
    // An unsaved personalized preview renders without changing saved content.
    const preview = await post(
      admin,
      {
        template: o.template,
        tier: "full",
        details: changed,
        event: "walima-id",
      },
      "/api/studio-preview",
    );
    assert.equal(preview.status(), 200);
    assert((await preview.text()).includes("srcdoc="));
    console.log(
      "PASS RSVP scoping, idempotency, review invalidation, stable event links, unsafe URL rejection and unsaved preview",
    );
    fs.writeFileSync(
      out + "/results.json",
      JSON.stringify({ results, errors }, null, 2),
    );
  } finally {
    if (page)
      await page
        .screenshot({ path: out + "/failure.png", fullPage: true })
        .catch(() => {});
    if (browser) await browser.close();
    server.kill();
    fs.rmSync(dir, { recursive: true, force: true });
  }
})().catch((e) => {
  console.error(e);
  console.error(errors);
  process.exitCode = 1;
});
