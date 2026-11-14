#!/usr/bin/env bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
node <<'JS'
const fs=require('node:fs');
if(fs.existsSync('.env.local'))fs.copyFileSync('.env.local','.env.local.before-partner-preview');
fs.writeFileSync('.env.local','WEDINVITE_ADMIN_USERNAME=admin\nWEDINVITE_ADMIN_KEY=WedInvite-Test-2026!\nWEDINVITE_DATA_DIR=.data-partner-preview\n',{mode:0o600});
JS
npm ci
npm run build
# Replace only this project's Next development/production server on port 3000.
node <<'JS'
const {execFileSync}=require('node:child_process');
try{const rows=execFileSync('ps',['-eo','pid,args'],{encoding:'utf8'}).split('\n');for(const row of rows){const m=row.trim().match(/^(\d+)\s+(.+)$/);if(!m||!/^next-server \(/.test(m[2]))continue;try{if(require('node:fs').realpathSync('/proc/'+m[1]+'/cwd')===process.cwd())process.kill(Number(m[1]),'SIGTERM')}catch{}}}catch{}
JS
nohup npm start -- --hostname 0.0.0.0 --port 3000 >/tmp/wedinvite-preview.log 2>&1 </dev/null &
for i in $(seq 1 60); do
 if curl --silent --fail http://localhost:3000/api/platform >/dev/null; then break; fi
 sleep 1
done
curl --silent --fail http://localhost:3000/api/platform >/dev/null || { echo 'Startup failed. Read /tmp/wedinvite-preview.log'; exit 1; }
if [ -n "${CODESPACE_NAME:-}" ]; then
 if gh codespace ports visibility 3000:public -c "$CODESPACE_NAME"; then
  echo "SHARE: https://${CODESPACE_NAME}-3000.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN:-app.github.dev}"
 else
  echo 'App is ready. In Ports, right-click port 3000 and choose Port Visibility > Public.'
 fi
fi
printf '\nAdmin username: admin\nAdmin password: WedInvite-Test-2026!\nOpen /admin to sign in. Use fictional test data only.\n'
