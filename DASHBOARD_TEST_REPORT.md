# Dashboard workflow verification

Verified against the production build with an isolated temporary database. Demo orders were not modified.

- PASS: Private admin endpoints deny anonymous writes
- PASS: Wrong credentials rejected; valid login survives reload
- PASS: Skipped steps and invalid contact details show actionable errors
- PASS: gulistan: create, private preview, activate, share and RSVP
- PASS: baradari: create, private preview, activate, share and RSVP
- PASS: shabistan: create, private preview, activate, share and RSVP
- PASS: basant: create, private preview, activate, share and RSVP
- PASS: charkha: create, private preview, activate, share and RSVP
- PASS: khat: create, private preview, activate, share and RSVP
- PASS: riwaj: create, private preview, activate, share and RSVP
- PASS: androon: create, private preview, activate, share and RSVP
- PASS: phoolpatti: create, private preview, activate, share and RSVP
- PASS: safar: create, private preview, activate, share and RSVP
- PASS: Duplicate URLs and invalid dates are rejected
- PASS: Editing an unknown order does not silently create another
- PASS: Edit, correction note, URL rename and persistence
- PASS: Concurrent guest replies are all retained
- PASS: Logout revokes the server session, including copied cookies
- PASS: Browser has no runtime errors

Fixes include shared field-specific validation, guarded step navigation, actionable customer contact and event errors, suggested custom URLs, phone normalization, URL collision rejection, missing-order edit rejection, calendar-date validation, server-side logout revocation, and personalized venue/date/family information. Native invitation RSVP buttons now open the connected guest reply form.

Limits: WhatsApp links were inspected, not sent. Real payments remain manually verified. This validates the tested scenarios, not a guarantee that every possible issue is absent. Storage requires one Node instance with persistent disk.
