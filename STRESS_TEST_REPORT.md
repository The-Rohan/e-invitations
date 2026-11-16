# Browser journey and load audit — 16 November 2026

## Method

Production Next.js build, Chromium, isolated temporary JSON database and randomized admin credentials. Existing customer data and production services were not changed. No WhatsApp messages or payments were sent.

The browser test runs 500 sessions with eight concurrent browser contexts, across 320/390/768/1440/1920 px viewports and all ten designs. Five repeated journey types cover navigation and FAQs; search/favorites/comparison; product previews and selection carryover; invalid contact submission, checkout and reload recovery; and guest RSVP. Some sessions use reduced motion or denied clipboard permission. This is automated coverage, not 500 real people or 500 simultaneous browsers.

A separate burst starts 500 concurrent HTTP workflows: three lead revisions followed by a guest reply and an idempotent retry. It checks that all 500 leads and 500 distinct replies persist without duplicate replies. Localhost results include test-machine contention and are not production capacity guarantees.

Additional regression suites cover admin orders, CRM, template editing/delivery, storefront mockups, and all combined/standalone invitation variants.

## Fixes

- The checkout footer’s back-to-top link had no matching target. Added the target and verified that clicking returns the page to scroll position zero.
- The checkout loading placeholder was much shorter than the contact form, pushing the summary abruptly out of view after hydration. Reserved loading space to prevent that visible jump.

- The homepage copy-link button previously threw an unhandled browser error when clipboard permission was denied. It now displays a selectable link and a clear manual-copy instruction. Automated browser journeys exercise this failure path.

## Results

- 500/500 browser journeys passed; zero captured page exceptions or HTTP 5xx responses.
- 500/500 concurrent HTTP workflows passed. All 500 load-test leads and 500 distinct replies were persisted; repeated reply requests did not create duplicates.
- Browser navigation to DOMContentLoaded: median 298 ms, p95 831 ms, worst 3,509 ms. These numbers are not LCP or time-to-interactive.
- Concurrent HTTP workflow duration: median 14,278 ms, p95 15,537 ms, worst 15,707 ms. Each workflow includes five sequential requests and small simulated pauses.
- HTTP request latency across 2,503 setup/load requests: median 2,929 ms, p95 4,184 ms, worst 7,805 ms. The burst is reliable but **too slow to promise immediate saving under this load**.
- Admin order regression passed; 13 CRM checks passed; editor-to-delivery workflow passed; all 40 template/event variants and RSVP scoping/idempotency/review invalidation checks passed.
- Storefront mockups, narrow layouts, and all ten template selections through resume/reload passed.
- Link crawl checked 35 distinct internal destinations/fragments and found the checkout top-anchor issue described above.
- Production build passed. Changed storefront lint has no errors; one pre-existing unused import warning remains. A broader lint check also found pre-existing issues in the legacy Platform component, so this is not a claim of a lint-clean repository.

### Mobile performance

Cold browser contexts, 390×844 viewport, 4× CPU throttling, approximately 1.6 Mbps download with 100 ms simulated latency. These are single-run lab observations, not field Core Web Vitals. The initial homepage LCP was 4.74 seconds: prioritize the hero media and delivery path before calling mobile loading optimized. Initial checkout CLS was 0.252; the loading-space correction above is checked again after the fix.

## Practical limits

This audit cannot certify every possible interaction or real-device behavior. Safari/iOS, Android hardware, assistive technologies and the public Codespaces network need separate checks. Links to WhatsApp are validated without sending messages. Browser tests repeat representative journeys rather than replacing exploratory usability sessions with real customers.

The current JSON storage rewrites the database on each mutation. It is intended for a single running app instance; a transactional database is needed before scaling across instances or making high-traffic production promises. Preserve this distinction when sharing the demo.

## Reproduce

Install app dependencies and build with `npm ci && npm run build`. Install Playwright separately for QA (`npm install --no-save playwright`) and Chromium (`npx playwright install chromium`). Set `CHROMIUM_PATH` to the installed Chromium executable, then run `node scripts/test_500_journeys.cjs`. Defaults are 500 browser sessions and eight workers; `JOURNEYS` and `WORKERS` override browser coverage. The HTTP burst remains 500 workflows. Port 3050 must be free. Reports are saved under `artifacts/500-journeys/`; test data is deleted at completion.


Post-fix verification: 25/25 browser journeys and a second 500/500 concurrent HTTP workflows passed, with no captured browser errors. Checkout's back-to-top button returned `scrollY` to zero. The second mobile measurement was:

| Route | LCP | CLS |
|---|---:|---:|
| Home | 4.636 s | 0.009 |
| Collection | 2.484 s | 0.012 |
| Gulistan product | 4.036 s | 0.001 |
| Order | 1.048 s | 0.039 |

The mobile measurements overlap other QA activity on the shared machine and are diagnostic, not a performance certification. The homepage and product LCP still need improvement under these conditions. Checkout CLS improved from 0.252 to 0.039.

For repeatable mobile measurements, run a production server separately and use `TEST_BASE=http://127.0.0.1:3051 node scripts/test_mobile_performance.cjs`. The script captures LCP, CLS, long tasks and transferred resource bytes for four pages under the throttling described above. Automated measurements do not establish perceived animation smoothness on physical phones.
