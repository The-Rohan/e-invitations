const fs = require('node:fs');
if (!fs.existsSync('.env.local')) {
  fs.writeFileSync('.env.local', 'WEDINVITE_ADMIN_USERNAME=admin\nWEDINVITE_ADMIN_KEY=WedInvite-Test-2026!\nWEDINVITE_DATA_DIR=.data-partner-preview\n', {mode: 0o600});
}
console.log('Ready. Open .env.local in the editor for your private admin credentials. Preview runs on port 3000.');
