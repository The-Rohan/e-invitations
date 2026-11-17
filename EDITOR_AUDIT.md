# Template editor audit — 17 November 2026

## Outcome

All ten templates passed the final browser editing matrix. All 337 independent wording controls (English and Urdu: 674 values) were edited through the actual editor, saved, reopened and checked against the rendered invitation. No recorded page exceptions, search failures or rendering mismatches remained in this run.

## Findings and fixes

The baseline tested 427 purported independent wording controls and found 97 mismatches: edits either disappeared during rendering or targeted nodes replaced by structured content. Ninety controls actually belonged to family, welcome, dress, travel or accommodation data. They now point users to the existing structured fields rather than offering ineffective duplicate inputs. The remaining independent overrides are applied after structured sections are populated, so they reach the final invitation. The inventory generator now records these bindings. Previously stored overrides for these newly classified fields remain accepted for compatibility; structured fields remain authoritative.

Search now includes original and customized English/Urdu text, labels and section names. Matching sections open automatically, and an empty search result has a clear message. Reset controls restore the original wording.

Text areas now have visible boundaries, consistent sizing, readable labels and focus outlines. English/Urdu controls have explicit accessible names. Mobile screenshots were inspected, and automated overflow checks passed at 390 px.

The editor now shows unsaved state and warns before refresh/tab closure or following ordinary page links with unsaved work. Saving exits normally. This is a manual-save workflow, not automatic draft recovery; use Review & save regularly, especially before browser-history navigation or changing devices.

## Per-template wording coverage

| Template | Independent controls | English + Urdu values | Result |
|---|---:|---:|---|
| Androon | 30 | 60 | Passed |
| Baradari | 40 | 80 | Passed |
| Basant | 40 | 80 | Passed |
| Charkha | 40 | 80 | Passed |
| Gulistan | 23 | 46 | Passed |
| Khat | 34 | 68 | Passed |
| Phoolpatti | 30 | 60 | Passed |
| Riwaj | 30 | 60 | Passed |
| Safar | 30 | 60 | Passed |
| Shabistan | 40 | 80 | Passed |

## Other checks

For every template, the browser matrix exercised reset, original/customized Urdu search, empty search results, opening language, primary event selection, larger text, music setting/URL, RSVP deadline and reply toggle, family/welcome/travel/accommodation fields, accommodation map, all offered optional-section checkboxes, and available custom-illustration URL fields. Saved state was inspected and editor values were checked after reopening. Both language data and actual Urdu DOM text were checked for independent wording, including line breaks, ampersands and literal angle-bracket text.

The existing 40-version rendering suite passed for combined invitations and three standalone event invitations across ten designs. It covers identity, dates, maps, calendar exports, event order/scope, review invalidation and unsafe URLs. The studio workflow suite also passed: event editing/reordering, unsaved preview without writing, mobile/desktop previews, saved review, activation, delivery and guest RSVP. Production build and targeted editor/validation lint passed.

Tests ran with randomized admin credentials and temporary data. No customer records, external messages or payments were changed. Custom illustration URLs used controlled image fixtures; this does not certify the availability of arbitrary customer-hosted media or live audio quality.

## Editor limits

- Original opening animations/gestures remain fixed. This is a structured invitation editor, not an arbitrary layout/animation designer.
- Custom artwork and music require direct HTTPS URLs; the editor does not upload or crop media.
- Structured identity, dates, event data and RSVP fields have their own controls. They are deliberately excluded from independent design wording.
- Desktop Chromium and mobile viewport emulation were used; this is not a complete physical iOS/Android or screen-reader audit.

## Reproduce

Build with `npm run build`, then run `node scripts/test_editor_matrix.cjs` with Playwright and Chromium installed. `CHROMIUM_PATH` overrides `/usr/bin/chromium`; port 3056 must be free. Reports and per-template screenshots are written to `artifacts/editor-matrix/`. Test data is removed at completion. Existing regression commands: `node scripts/test_studio_workflow.cjs` and `node scripts/test_template_suite.cjs`.
