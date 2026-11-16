# Independent event addresses and complete-invitation visibility

Open **Admin → select an order → Invitation delivery suite → Link settings**.

1. Enter an address for each event, for example `ayesha-mehndi`, `bilal-barat`, and `family-walima`. The public URLs become `/event/ayesha-mehndi`, `/event/bilal-barat`, and `/event/family-walima`.
2. Uncheck **Allow guests to open the complete invitation** if guests should only receive standalone invitations.
3. Save link settings. Copy individual links or the full delivery message from the delivery suite.

Removing the last segment of an independent event URL leads to `/event`, which does not show the complete invitation. The complete invitation's existing address can still be edited in the invitation editor. Existing records retain their current sharing behavior until you change and save these settings.

When complete-invitation access is off, the public content API, metadata endpoint and unscoped RSVP submission are blocked, including requests using the old couple slug or internal order ID. Admin preview access remains available. Complete-invitation copy/share buttons and its entry in the delivery message are hidden. Scoped event links continue working.

Independent addresses are globally unique, 3–80 lowercase letters/numbers with single hyphens. Renaming an address disables the previous independent address; retired addresses stay reserved against reassignment. Existing nested event addresses continue to work. Event addresses remain public shareable URLs, not individual guest passwords.

The server resolves independent aliases to their fixed event. Removing or changing an event query parameter cannot turn an independent alias into another event or the complete invitation. Authorization is checked when reading invitation content and saving link settings. Link revisions reject conflicting saves from another admin tab.

Validation: production build and targeted lint passed. Integration tests exercised the actual admin form and copied delivery message, three scoped guest RSVPs, trimming the URL, disabled complete HTML/meta/preview/RSVP endpoints, admin previews, alias scope overrides, anonymous configuration attempts, duplicate aliases, stale revisions, renaming addresses and restoring complete visibility. Existing nested-link, event rename/reorder/deletion, admin order and studio fulfillment regression suites passed. Tests used isolated temporary data.

Repeat with `node scripts/test_event_links.cjs` after building; Playwright and Chromium are required. No production records were modified by these tests.
