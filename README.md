# WedInvite — storefront and invitation studio

This app includes the storefront, orders/CRM, admin studio, and all ten original invitation designs. The separate original-template repository is not required to run it.

## Run locally from the ZIP

1. Install **Node.js 24**.
2. Extract the ZIP and open a terminal in the extracted folder containing `package.json`.
3. Copy `.env.example` to `.env.local`. Set `WEDINVITE_ADMIN_USERNAME` and replace `WEDINVITE_ADMIN_KEY` with your own long password. If there is no example file, create `.env.local` with:

   ```env
   WEDINVITE_ADMIN_USERNAME=admin
   WEDINVITE_ADMIN_KEY=YOUR_OWN_LONG_PASSWORD
   WEDINVITE_DATA_DIR=.data
   ```

4. Run:

   ```sh
   npm ci
   npm run dev
   ```

5. Open http://localhost:3000. Sign in at http://localhost:3000/admin with the credentials you configured. Keep the terminal open; Ctrl+C stops the server.

For a production build, use `npm run build` followed by `npm start`. The app needs a running Node server and persistent disk; GitHub Pages cannot run the admin, CRM, or invitation APIs. See `RUN-ON-GITHUB.md` in the distribution ZIP for GitHub build instructions.

## Create and deliver a wedding suite

Open an order → **Edit invitation**, or choose **Create invitation**. Select the design and a package covering the required event count. Enter the couple and event details, then use the template-specific settings in **Review & save**. The personalized preview supports the full invitation and each standalone event, on desktop and mobile, before saving.

After saving, open the order's **Invitation delivery suite**. A three-event order has four links: the complete invitation, Mehndi only, Barat only, and Walima only. Preview and mark each current version reviewed. Verify payment to activate the links, copy the delivery message, and track fulfillment. Content changes reset review checks.

See [TEMPLATE_STUDIO.md](TEMPLATE_STUDIO.md) for supported controls, review behavior, limitations, and test commands, and [STUDIO_OPERATIONS.md](STUDIO_OPERATIONS.md) for CRM operations.

## Updating an existing installation

Back up and keep `.env.local` and the entire configured data directory. Copy updated application files without replacing those private files. Run `npm ci`, rebuild if using production mode, and restart the app. Existing orders remain available; editing and saving one in the current studio enables the new delivery review workflow. No production data or credentials are included in the distribution ZIP.

## Live GitHub Codespaces preview

Create a Codespace from the `wedinvite-final-2026-11-14` branch. The included devcontainer installs dependencies, generates unique credentials in `.env.local`, and starts the full app. Open the forwarded port 3000 from the Ports panel; append `/admin` for the studio. Open `.env.local` in the editor to read your admin username and password. Use sample customer/payment data while testing; activation is a manual action and does not collect money.

The preview is private by default. Records persist in this Codespace's `.data` directory across stops/restarts. Deleting the Codespace deletes its local records, so download a backup first if needed. Codespaces is a development preview, not always-on hosting; GitHub account quotas and billing apply. Keep `.env.local` out of commits and do not expose a development server publicly.
