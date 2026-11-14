# Run WedInvite from GitHub

## Which ZIP?

- **wedinvite-app-crm.zip**: the complete Next.js application, storefront, all ten templates, guided ordering and admin CRM. This is the main download. It runs by itself.
- **wedinvite-original-templates.zip**: the original standalone HTML templates, useful for design work. It does not contain the CRM and is not needed to run the main app.

Extract the main ZIP first. Upload the extracted project files to GitHub, not the ZIP itself. GitHub stores your code; GitHub Codespaces can run the development app. GitHub Pages cannot run the Next.js backend, admin sessions or CRM.

## 1. Put the app in a GitHub repository

Create a new **private**, empty GitHub repository, for example `wedinvite-platform`. Leave “Add README” unchecked. On your computer, open a terminal inside the extracted `wedinvite-app-crm` folder and run:

```bash
git init
git add .
git commit -m "Add WedInvite storefront, ordering and CRM"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/wedinvite-platform.git
git push -u origin main
```

Replace YOUR-USERNAME with your GitHub username. Use your normal GitHub sign-in or Git credential manager when prompted. The app includes `.gitignore` rules to exclude private settings, customer records and installed dependencies.

If you prefer the existing e-invitations repository, back up its `dawatna/.data` and `dawatna/.env.local`, then put the app source inside `dawatna/`, preserving those private files. Run all app commands inside `dawatna/`. The supplied GitHub Actions workflow assumes a repository-root app; for this nested arrangement place it at the repository's `.github/workflows/build.yml`, set `defaults.run.working-directory: dawatna`, and set setup-node's `cache-dependency-path: dawatna/package-lock.json`.

## 2. Run directly in GitHub Codespaces

On the repository page select **Code → Codespaces → Create codespace on main**. In its terminal, inside the folder containing package.json:

```bash
nvm install 24
nvm use 24
npm ci
cp .env.example .env.local
```

If Node 24 is already active (`node --version`), skip the nvm commands. Edit `.env.local` in the Codespaces editor. Set your admin username and a long unique password:

```dotenv
WEDINVITE_ADMIN_USERNAME=admin
WEDINVITE_ADMIN_KEY=YOUR_OWN_LONG_RANDOM_PASSWORD
WEDINVITE_DATA_DIR=.data
```

Do not commit `.env.local` or `.data`. No real orders or preconfigured admin credentials are included in these downloads. For an existing installation preserve your current settings instead of overwriting them.

Then run:

```bash
npm run dev -- --hostname 0.0.0.0 --port 3000
```

Open the **Ports** tab, find port **3000**, and choose **Open in Browser**. Keep the forwarded port private for your own testing. Use the address Codespaces supplies, not a localhost URL on your computer.

Routes on that address:

| Route | Purpose |
| --- | --- |
| `/` | Storefront |
| `/templates` | Ten invitation designs |
| `/order` | Guided customer ordering and WhatsApp handoff |
| `/admin` | Login and invitation management |
| `/admin/crm` | Leads, progress, follow-ups, payment review and delivery pipeline |

Sign in at `/admin` with the credentials from `.env.local`, then open `/admin/crm`. In a separate browser tab, fill in `/order` to see lead updates in the CRM within about two seconds. Test data is real data in this installation's `.data/platform.json`; use clearly labeled sample entries.

Codespaces is a development environment: it may stop when idle, and its files disappear when the codespace is deleted. It is not your always-on customer hosting service.

## 3. Build checks on GitHub

The included `.github/workflows/build.yml` runs `npm ci` and `npm run build` on pushes and pull requests using Node 24. The build includes TypeScript checks. Open the repository's **Actions** tab to see results. This workflow checks the code; it does not deploy the app or run a permanent server. It was prepared from locally verified build commands; it has not been executed on your GitHub account.

To run the same check yourself:

```bash
npm run build
```

## 4. Put it online for customers

Use a Node 24 host/VPS with **persistent disk and one application instance**, connected to your GitHub repository. Configure:

- Install command: `npm ci`
- Build command: `npm run build`
- Start command: `npm start -- --hostname 0.0.0.0`
- Runtime environment: `WEDINVITE_ADMIN_USERNAME`, `WEDINVITE_ADMIN_KEY`, and `WEDINVITE_DATA_DIR` pointing to your persistent private data directory (for example `/var/lib/wedinvite`).
- Public HTTPS and a process manager/restart policy. The app uses secure admin cookies in production, so HTTPS is required for public login.

Back up the data directory. Keep it separate from build/release directories so a deployment does not erase orders, leads, sessions or RSVPs. Do not use ephemeral serverless storage or multiple replicas with the current JSON store. Migrate all records to a transactional database first if you need that architecture.

WhatsApp links open prepared messages; customers/staff still tap Send. Payments are manually verified. No WhatsApp chat synchronization or automated payment integration is included.

## Optional: original templates only

Extract `wedinvite-original-templates.zip`, open a terminal in its folder, then run:

```bash
python3 -m http.server 8000
```

These are original samples. Their standalone RSVP/order links are not the connected application; use the main app for ordering, personalization, CRM and guest replies.

## Package verification

`SHA256SUMS.txt` lists archive checksums. On Linux/macOS you can compare with `sha256sum` or `shasum -a 256`. Archives were checked for integrity and exclusion of `.env.local`, `.data`, node_modules and Git history before delivery.
