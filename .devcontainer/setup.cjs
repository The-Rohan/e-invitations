const fs = require('node:fs');
const crypto = require('node:crypto');
if (!fs.existsSync('.env.local')) {
  fs.writeFileSync('.env.local', 'WEDINVITE_ADMIN_USERNAME=admin\nWEDINVITE_ADMIN_KEY=' + crypto.randomBytes(24).toString('hex') + '\nWEDINVITE_DATA_DIR=.data\n', {mode: 0o600});
}
console.log('Ready. Open .env.local in the editor for your private admin credentials. Preview runs on port 3000.');
