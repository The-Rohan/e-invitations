#!/usr/bin/env bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
export PATH="$HOME/.local/share/wedinvite-node/bin:$PATH"
if ! command -v node >/dev/null 2>&1 || [ "$(node -p 'process.versions.node.split(".")[0]')" != "24" ]; then
  echo 'Installing Node.js 24 for this workspace...'
  case "$(uname -m)" in
    x86_64) node_arch=x64 ;;
    aarch64|arm64) node_arch=arm64 ;;
    *) echo 'Unsupported CPU architecture'; exit 1 ;;
  esac
  node_temp=$(mktemp -d)
  curl --fail --location --retry 3 --silent --show-error https://nodejs.org/dist/latest-v24.x/SHASUMS256.txt -o "$node_temp/SHASUMS256.txt"
  node_file=$(awk -v arch="$node_arch" '$2 ~ ("^node-v24\\.[0-9]+\\.[0-9]+-linux-" arch "\\.tar\\.xz$") {print $2}' "$node_temp/SHASUMS256.txt")
  [ -n "$node_file" ] || { echo 'Could not locate the official Node.js download'; exit 1; }
  curl --fail --location --retry 3 --silent --show-error "https://nodejs.org/dist/latest-v24.x/$node_file" -o "$node_temp/$node_file"
  (cd "$node_temp" && awk -v file="$node_file" '$2 == file' SHASUMS256.txt | sha256sum --check -)
  mkdir -p "$HOME/.local/share/wedinvite-node"
  tar -xJf "$node_temp/$node_file" --strip-components=1 -C "$HOME/.local/share/wedinvite-node"
  rm -rf "$node_temp"
  printf '\nexport PATH="$HOME/.local/share/wedinvite-node/bin:$PATH"\n' >> "$HOME/.bashrc"
fi
node --version
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
