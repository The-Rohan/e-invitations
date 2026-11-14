# Template-aware invitation studio

The original ten templates remain the source of their artwork, opening films, layout, language switching, music and date-reveal interactions. The renderer binds structured order data into each design. `TEMPLATE_AUDIT.md` records their sections and localized copy; `lib/template-manifest.json` records every bilingual text node and original HTML hash. A changed original HTML file requires regenerating the inventory and rerunning verification before delivery.

## Available controls

- English/Urdu couple names, family and welcome wording; opening language and reading size.
- Up to the purchased package's event count, with stable event IDs, reordering, bilingual event/venue/address/description/dress wording, exact HTTPS map links, separate seating, dress palettes and schedules.
- Pakistan local start/end dates and times; overnight end dates; primary date reveal/countdown selection. Each standalone uses its own event date automatically.
- Actual design-specific sections and searchable English/Urdu wording. Core entrance, hero, reveal and event sections are preserved. Optional sections can be hidden. Empty travel, stay, dress and schedule blocks do not advertise sample arrangements.
- Design-specific illustrations, event art or motifs where offered, accent color, original or custom HTTPS audio, music toggle, RSVP deadline and RSVP toggle. Khat deliberately has only an opening-still image slot because its other sections are typographic.
- Opening films remain the original artwork. Image/audio URL fields require hosted files; there is no upload/transcoding service or arbitrary layout editor. Names embedded in a user-supplied image cannot be changed as text.

## One order, four invitation links

For a Mehndi + Barat + Walima order, the delivery suite creates:

1. `/invite/{slug}` — all three events.
2. `/invite/{slug}?event={mehndi-id}` — Mehndi only.
3. `/invite/{slug}?event={barat-id}` — Barat only.
4. `/invite/{slug}?event={walima-id}` — Walima only.

Each standalone has its own hero/date reveal, event card, map, calendar dates, schedule, dress information and RSVP scope. Shared couple/design/travel settings remain consistent. Links use stable IDs, so renaming or reordering events keeps existing links attached to the same event. Removing an event makes its old link unavailable. Changing the order slug changes all its public URLs.

These are hosted, shareable invitation websites, not offline HTML exports. The delivery text download contains all URLs. Image/video add-ons still need separate studio creation and delivery; this feature does not generate video exports.

## Preview and delivery workflow

In **Review & save**, open **Personalized preview**, choose combined or a single event, and switch Mobile/Desktop. This renders current unsaved values without writing to the database. The preview RSVP button explains the connected flow without collecting responses.

Saved orders have a delivery suite with one review flag per current version. Review checks use the saved content revision. Editing resets checks and returns Ready/Delivered orders to In production, including their linked CRM inquiry. Outdated save/review requests from the editor are rejected. Ready/Delivered is blocked until payment activation and all current versions are reviewed. Reviews are staff attestations, not automatic proof that someone inspected every screen.

Live RSVPs record attendance against individual stable event IDs. Standalone links cannot submit an RSVP for an unrelated event. Retries from the same form request are idempotent. The admin order displays per-event replies. Maps use supplied URLs or a venue/address search; Google Calendar and folded UTF-8 Apple/iPhone ICS downloads use the event's Pakistan-time schedule.

## Verification

Run `npm run build` first. Browser scripts need Playwright and Chromium installed in the test environment; set `PLAYWRIGHT_MODULE` and `CHROMIUM_PATH` if applicable. Tests start their own servers with temporary data directories and generated credentials, never customer data.

- `node scripts/test_template_suite.cjs` — port 3020, all ten designs × combined and three standalone variants; native reveal interactions under reduced motion, English/Urdu escaping, event maps, accommodation maps, custom-image bindings, calendar links/ICS, 1440/390/320 layouts, event-scoped RSVP, retry deduplication, stale review/save rejection, review reset, stable links and preview authorization.
- `node scripts/test_studio_workflow.cjs` — port 3021, actual editor, unsaved scoped preview, reordering, saving, four-version review, clipboard delivery message, responsive order detail and live RSVP form.
- `node scripts/test_dashboard.cjs` — port 3002, existing create/preview/payment/activation/reply/correction/fulfillment/auth workflows.
- `node scripts/test_crm.cjs` — port 3003, existing autosave, lead conversion, stage/payment synchronization and conflict protection.

Browser verification uses Chromium emulation. Physical iPhones/Safari and all possible text lengths, external media hosts, fonts or third-party map/calendar services cannot be guaranteed by these checks. Review real customer content in both preview modes before sending it.

Persistence continues to use the existing atomic JSON store. Run a single Node instance with persistent disk and backups. Multiple application replicas require moving this store to a transactional database.
