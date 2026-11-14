# WedInvite studio operations

## Customer journey
Browse `/templates` → read a design’s `/templates/{design}` page → WhatsApp +92 300 1063545. The studio collects names (optional Urdu names), WhatsApp number, up to three events with dates, times, venues and addresses, and family message. No customer signup or checkout is needed. Easypaisa / JazzCash: 03001063545. Confirm the recipient in the payment app; verify the transfer yourself before activation.

## Run and configure
Node 24, npm 11. `npm ci`, `npm run build`, `npm start` for production; `npm run dev` for development. Configure **WEDINVITE_ADMIN_USERNAME** and a strong random **WEDINVITE_ADMIN_KEY** (the login password) securely on the server. Never commit it. `/admin` uses the username and password login. Cookies are HTTP-only, same-site, and secure in production, where HTTPS is required.

Set **WEDINVITE_DATA_DIR** to a private persistent directory outside public assets. Default: `.data` in the app root (gitignored). Back up this directory. This implementation uses an atomic local JSON store and supports a **single Node instance with persistent disk**. Do not deploy to ephemeral serverless storage or multiple replicas; migrate storage to a transactional database first. Restart with the same configured key to retain admin sign-in.

## Create and deliver
1. Sign in at `/admin`, then choose **Create invitation**.
2. Select any of the ten original designs, package and optional add-ons.
3. Enter details and up to three events. Times use Asia/Karachi.
4. Review and choose an available lowercase URL, e.g. `bilal-and-mahrukh`.
5. Save. Preview from the dashboard. Edit any saved invitation through its edit link, including activated invitations.
6. After independently verifying payment, choose **Verify payment & activate**.
7. Copy the live `/invite/{custom-url}` link or use Message customer / Share on WhatsApp. These open WhatsApp with a prepared message; they do not send automatically.
8. Guests can submit a reply through **Reply with love**; replies appear on the order card.

Activation is enforced by the invitation API. Original unpersonalized samples remain public. Duplicate custom URLs are rejected. Editing a published URL changes it immediately, so retain the original URL unless the customer requests a change.

## Scope and fulfillment
Packages follow the supplied current offer: Basic Rs. 4,999, Premium Rs. 7,999, Full Rs. 11,999. Add-ons: image Rs. 300, video Rs. 500, event pack Rs. 3,000. Template eligibility is confirmed by the studio; all ten designs are available in the editor. Full/add-on image/video packs are manually produced and sent by the studio on WhatsApp; this app does not render MP4s or dispatch WhatsApp messages automatically. There is no automatic payment gateway or bank verification.

The ten original templates retain their gestures, art and media. The server adapts event data, calendars, countdown and reveal date, and couple names. Dates and maps use submitted details; decorative sample prose and art remain part of each design. English/Urdu controls are retained; event fields are shown in the language the studio enters them.

## Validation
Production build includes TypeScript. Browser/API smoke checks cover all ten product pages, personalization, private access denial and activation. Browser check artifacts are temporary and not customer data. Existing unrelated repository lint defects were present before this work. Before public launch add durable backups, platform-level login rate limits, monitoring and deployment-specific origin configuration as appropriate.

## Local demonstration
This workspace has an ignored `.env.local` with demo login settings and ten clearly marked sample orders in `.data/platform.json`. The public sample URLs are `/invite/demo-{design}`, except private examples remain gated. Demo credentials are for local review; replace them before a public launch. Demo records do not represent real transfers or customers.

## Package fulfillment

Original prices are unchanged: One celebration Rs. 4,999 (1 event); The wedding website Rs. 7,999 (up to 3 events); The complete suite Rs. 11,999 (up to 3 events plus 2 status images, 1 status video and 3 separate event invitation images). Image/video files are prepared and delivered manually by the studio. Each package includes 2 edit requests. Delivery within 24 hours starts after complete details and payment verification.

## Create an invitation in the admin desk

1. Choose the customer's design and package.
2. Enter both names and the customer's WhatsApp number (local 03001063545 or international +923001063545). Urdu names and the family message are optional.
3. Enter each event's name, date, time and venue; street address is optional. Dates and times use Pakistan time.
4. Review the details, adjust the suggested custom URL, confirm the details and save. The invitation is still private.
5. Open Preview from its dashboard card, check the details, and edit if needed.
6. After manually verifying payment, choose Verify payment & activate. Then copy or share the live link.

Step navigation checks required details before advancing. Errors identify the exact field and event; entered details remain in the form. Server-side validation uses the same rules. Custom URLs must be unique.

## Original device-specific previews

Public previews load the original template demo wrapper: the original iPhone frame on desktop (760px and above), and the full-screen card on narrower devices. The original wrapper handles resizing and card scaling. Both retain the faint preview watermark. Its purchase links return to the matching product page.

## Guided ordering and CRM

`/order` is the customer journey: contact → design/package → payment → WhatsApp. Product/package CTAs preserve selections. Wedding details and receipts are coordinated on WhatsApp at +923001063545. Customers may continue before paying; a payment claim is explicitly unverified.

`/admin/crm` uses the existing admin session. It refreshes every two seconds and shows partial entries, current/furthest step, last saved activity, payment claims, notes, assigned staff, Pakistan-time follow-ups and pipeline status. “Inactive” means no saved customer changes for 15 minutes, not proof of abandonment. Anonymous inquiries cannot be contacted until a usable number is entered. WhatsApp-open events do not prove a message was sent.

Create an invitation from a lead to prefill design, package, add-ons and contact number. Couple/event details remain admin-entered. Saving links the invitation atomically; repeat conversions are rejected. Existing invitations can also be linked. Payment review in CRM does not activate the invitation: use the existing invitation review/activation action. Mark Ready/Delivered after actual review/delivery.

Persistence: leads are additive records in the existing private `.data/platform.json`, preserving orders, sessions and RSVP records. Keep one Node process and persistent disk; this is not a multi-instance database. Back up the entire configured WEDINVITE_DATA_DIR. For multiple replicas, migrate all records together to a transactional database before deploying.

Customer drafts use a random 256-bit browser resume token (only its hash is stored server-side), local queued changes, and monotonic revisions. Saves debounce at roughly 0.5–1.1 seconds; failed requests retry. Identical retries are idempotent and stale/conflicting writes are rejected. Resume is for the same browser; clearing browser storage loses its resume capability. Browser storage is not a server backup. Save status and the data-saving notice are visible to customers. CRM never receives customer resume tokens.

Validation: `npm run build`, then `node scripts/test_crm.cjs` (PLAYWRIGHT_MODULE and CHROMIUM_PATH may be set). The CRM test starts port 3003 with isolated temporary data and generated admin credentials. Existing `scripts/test_dashboard.cjs` uses port 3002. Never run write tests against customer data. Reports/screenshots go in ignored artifacts directories.

## Personalized admin previews

Saved-invitation previews (`/invite/{id-or-slug}?preview=1`) now use the same original template shell as public previews: desktop phone mockup at 760px and above; full-screen card below 760px. The shell embeds the saved personalized card, not sample content. Draft access remains admin-only, and RSVP messages are relayed through the shell. Purchase prompts are hidden in this customer-specific preview. Normal live invitation links continue to load the direct card.


## November 14 storefront and order desk update

The hero and design collection share the original iPhone frame asset, scaled at its native aspect ratio. Selection links carry the design and package into `/order`, including when resuming a saved inquiry. Initialization ignores canceled development-mode effects before consuming those query parameters.

`/admin` is now an order table with search, sorting, payment/fulfillment views, totals and automatic five-second refresh. Open an order to view invitation, payment, customer, events, replies, correction notes and next actions. Order detail URLs use `/admin?order=ID` and support reload and browser history. Linked orders and CRM inquiries link to each other.

Payment approval activates the invitation and records verification in the linked lead. Fulfillment is separate: Unfulfilled → In production → Ready to deliver → Delivered. Ready/Delivered require an activated invitation. Updating fulfillment updates the linked CRM stage; updating a linked CRM stage to In production, Ready or Delivered updates order fulfillment. Delivery is recorded manually, after sending the invitation and included files. WhatsApp buttons open prepared messages; they do not send them or prove delivery. Existing orders without a fulfillment value appear as Unfulfilled.

New conversions carry over the customer's payment reference, show payment claims as Needs review, and start In production. Staff still verify the actual transfer independently. No data migration or new runtime dependencies are required. Preserve `.env.local` and the configured data directory when updating an existing installation.

Additional browser checks: `node scripts/test_admin_orders.cjs` starts an isolated test server on port 3005; `node scripts/test_storefront_updates.cjs` uses `TEST_BASE` (default localhost:3000) and writes a labeled sample inquiry, so use an isolated test data directory. All scripts require Playwright and Chromium; use PLAYWRIGHT_MODULE / CHROMIUM_PATH overrides if needed.

## Template-aware delivery suites

The current studio supports per-template bilingual wording and sections, per-event directions/schedules/dress details, and an unsaved personalized preview. Each order now offers a combined invitation plus an independently shareable invitation for each event. Use the order's delivery suite to inspect mobile/desktop versions and record review checks before marking ready or delivered. Changes to saved invitation content invalidate these checks and return ready/delivered orders to production. See `TEMPLATE_STUDIO.md` for the full workflow and supported controls.
