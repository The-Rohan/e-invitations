# Guided ordering and studio CRM

The application baseline was recovered from the verified November handoff archive at e-invitations commit b519a48386c26f088940d705dbdfc642308035fe (ZIP SHA-256 460c55f6f27376cbfbff2d57320ad846cb3bedfcf791f7bd5c2a218ee9107bdb). The checked-out main branch previously contained only the initial prototype. The original source was preserved outside the checkout at /workspace/handoff-review/pre-integration.

## Entry points
- /order: contact, original design/package selection, manual payment, WhatsApp coordination.
- /admin/crm: protected lead inbox, search/filters, step funnel, inactivity, payment review, follow-up scheduling, staff notes, assignment, pipeline, history, invitation linking.
- /admin/create?lead=REFERENCE: prefilled studio workflow, atomically linked on save.
- Product/package buttons preserve choices in /order; /checkout now redirects there.

## Verified
- Production build and TypeScript passed.
- 13 new CRM/customer workflow groups passed (scripts/test_crm.cjs).
- 20 dashboard groups passed (scripts/test_dashboard.cjs).
- All 10 responsive previews and product preview link passed (scripts/test_previews.cjs).
- All package prices, inclusions, preserved order selections and 320/390px layouts passed (scripts/test_offers.cjs).
- Targeted lint for new customer/CRM components, types and API routes passed.
- Browser screenshots reviewed under artifacts/crm-tests (ignored).

Write tests use isolated temporary databases. Tests do not send WhatsApp messages or verify real payments. The live reference site was blocked by the network proxy, so supplied screenshots were used as the UX reference.

## Operations
See STUDIO_OPERATIONS.md. No public deployment or publication was performed. JSON storage remains single-process and requires persistent disk; backups and any multi-instance database migration belong to deployment planning. No new runtime packages or credentials are required. Existing demo login settings were recovered only where no local configuration existed.

## November 14 follow-up

Added shared iPhone mockups in the hero and collection, reliable selected-design checkout initialization, and the searchable order desk with payment/fulfillment separation. Order and CRM fulfillment stay synchronized. See STUDIO_OPERATIONS.md for navigation and delivery semantics. No environment or GitHub publication was performed for this follow-up.
