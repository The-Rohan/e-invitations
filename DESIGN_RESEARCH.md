# WedInvite storefront redesign

The review used the competitor site archives supplied in this repository. All seven page sources were read; Niru, Ceremonia Invites and Dawatnama Store were also rendered in Chromium. Some archived images and remote catalog data were unavailable, so this is a review of the supplied copies, not a claim about the current live websites.

| Supplied source                                                           | Useful pattern                                                                  | WedInvite implementation                                                                                                        |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `../niru.pk/niru.pk/index.html`                                           | An invitation guests can immediately experience; prominent collection discovery | Playable original films, interactive previews, category filters, search and a two-design comparison                             |
| `../dawatnama.store/dawatnama.store/index.html`                           | A tactile invitation as the hero rather than a generic marketing illustration   | An arched film stage, original floral mark, wax-style studio seal and layered phone previews                                    |
| `../ceremoniainvites.com/ceremoniainvites.com/index.html`                 | Designs presented as individual products                                        | Ten detailed product pages with gallery views, palette, occasion, design story, package selection and contextual WhatsApp links |
| `../sehra.pk`, `../dawatnama.app`, `../dawatlink.com`, `../osinvites.com` | Clear conversion routes, previews, feature explanation and package presentation | Concierge process, illustrated sharing section, interactive feature tabs, package comparison and FAQs                           |

## Design choices

Bright blush paper, plum typography, fine botanical lines and cream surfaces establish WedInvite's own identity. Original template media provide the main imagery; competitor branding and artwork are not copied into the storefront. Each of the ten invitation files was inspected, and screenshots were captured after its opening animation settled. Opening films retain their real motion; a pause button and reduced-motion preference provide control.

Discovery supports saved favourites across visits, search, category filters, quick previews and side-by-side comparison. Product pages keep design and package context in their WhatsApp message. Mobile pages provide a persistent product inquiry button. Customers contact the studio; the existing admin-only creation, manual payment verification and activation flow remains the fulfillment path.

## Verification

`npm run build` checks production compilation and TypeScript. `scripts/test_storefront.cjs` exercises previews, Escape dismissal, persistent favourites, search, comparison, all ten product galleries, package-specific WhatsApp links, mobile navigation and horizontal overflow. Optional admin credentials enable its login check. Full-page screenshots are written to ignored `artifacts/`. Invitation artwork captures live in `public/showcase/` and are delivered with the site.

## November package and visual revision

Reviewed the saved competitor sites and original offer again. Applied clearer outcome-based package names, explicit event limits, side-by-side inclusions, and a WhatsApp message that preserves the selected design/package/price. Original prices remain Rs. 4,999 / 7,999 / 11,999. The complete suite specifies one website plus six manually prepared sharing files. Shared offer definitions drive both the storefront and admin package descriptions; the API enforces event limits.

Visual direction: warm ivory, rose and blush, Playfair Display and Outfit, layered invitation artwork, larger design previews, distinct format examples and readable mobile package cards. The original ten template styles remain available across all packages.

Validation: production build; storefront browser checks across all ten products; package inclusion and WhatsApp context assertions; 320px and 390px overflow checks; desktop and mobile screenshot review. Existing Platform component lint warnings/errors about effect-driven state initialization remain outside this visual revision; the new storefront and offer files pass lint.
