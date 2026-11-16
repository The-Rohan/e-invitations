# Readable event links and loading improvements

16 November 2026

## Event links

The delivery suite now generates readable URLs such as:

- `/invite/ayesha-and-bilal` — complete invitation
- `/invite/ayesha-and-bilal/mehndi`
- `/invite/ayesha-and-bilal/barat`
- `/invite/ayesha-and-bilal/walima`

The server assigns an event URL when saving. Its address is preserved when the event name changes or the events are reordered. Duplicate names receive a numbered suffix. Removed event addresses are reserved so an old link cannot unexpectedly show a replacement event. Non-Latin-only names receive `celebration` and numbered suffixes. Existing `?event=...` URLs remain supported.

Admin previews, copy-link controls and delivery messages use the readable paths. The complete invitation, stable event IDs, RSVP scope and manual payment activation remain in place. Private invitations remain inaccessible to guests. Existing invitations gain readable addresses without a migration; the next save preserves their existing derived event paths.

## Loading changes

- Removed the render-blocking Google font stylesheet. Urdu uses the existing local font, with swap behavior and an Arabic Unicode range.
- Preload the two main locally hosted typefaces.
- Load the shared iPhone frame eagerly so visible collection/product mockups do not wait for lazy-load scheduling.
- Opening films start with responsive optimized poster images. Videos use `preload="none"` and autoplay only while visible, respecting reduced-motion preferences.
- Films pause offscreen; a deliberate manual pause remains paused when scrolled back into view.
- The below-the-fold experience background is a lazy optimized image rather than an eagerly downloaded full-size CSS background.

No storage migration, payment behavior change or customer-data rewrite is part of this update. The earlier high-concurrency write bottleneck remains a separate database scaling concern.

## Validation

- Production build passed.
- All 40 combined and standalone template variants passed, including maps, calendars, content rendering, RSVP scoping, stable event IDs, review invalidation and unsafe URL handling.
- Studio editor-to-delivery workflow passed, including all four reviewed versions and clean URLs in the copied delivery message.
- Clean-link integration tests passed: private access, three event-specific RSVPs, old links, renaming/reordering, duplicate names, deletion/replacement and ignoring forged client-side slugs.
- Storefront checks passed at 320/390/768/1440 px; all ten template selections survive checkout resume/reload.
- Media checks passed: no autoplay download for reduced-motion users, local Urdu font, manual playback, autoplay, pause persistence, view switching and no page exceptions.
- Targeted lint has no errors; the existing unused `offerInquiry` import warning remains.

Run `node scripts/test_event_links.cjs` against a built app for isolated URL integration tests. Run `TEST_BASE=http://127.0.0.1:3051 node scripts/test_media_loading.cjs` against a local preview for media checks. Both use Playwright and `CHROMIUM_PATH` (default `/usr/bin/chromium`).

## Performance measurements

The mobile comparison uses cold browser contexts, 390×844 viewport, 4× CPU throttling, 1.6 Mbps download and 100 ms simulated latency. These are local lab measurements, not production guarantees or field Core Web Vitals. Final figures are recorded below.


| Page | Before LCP | Final LCP | Final CLS |
|---|---:|---:|---:|
| Homepage | 4.708 s | 1.692 s | 0.009 |
| Collection | 1.808 s | 1.184 s | 0.005 |
| Gulistan product | 3.740 s | 1.532 s | 0.000 |
| Checkout | 1.020 s | 1.132 s | 0.000 |

Homepage transferred resource bytes fell from 877,670 to 592,315 (~33% reduction). Its measured LCP improved about 64%; the Gulistan product improved about 59%. Checkout LCP varied slightly upward by 112 ms while remaining near one second, with zero measured layout shift. These are single-run comparisons with cold browser contexts on the same machine and throttling configuration; results vary with device, network, cache and hosting. This does not establish production capacity for 500 simultaneous writers.
