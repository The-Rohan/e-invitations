# WedInvite — application and CRM downloads

- [Complete application with storefront, ordering, CRM and all ten templates](./wedinvite-app-crm.zip?raw=true)
- [Original standalone templates (optional)](./wedinvite-original-templates.zip?raw=true)
- [GitHub and Codespaces setup instructions](./RUN-ON-GITHUB.md)
- [SHA-256 checksums](./SHA256SUMS.txt)

The complete app is self-contained. Extract it before uploading its source to your own application repository. Private environment settings, customer data, dependencies and Git history are excluded. Configure your own admin credentials using the included .env.example.

The packaged app passed a fresh npm ci and production build. The implementation also passed 13 CRM workflow groups, 19 dashboard groups, all ten responsive previews, and package/mobile layout checks. GitHub Actions configuration is included for build checks; it does not deploy the application.

Use one Node instance with persistent storage for the current backend. GitHub Pages cannot host the CRM backend. See the setup guide for Codespaces and production hosting requirements.
