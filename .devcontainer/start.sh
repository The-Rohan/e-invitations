#!/usr/bin/env bash
set -e
export PATH="$HOME/.local/share/wedinvite-node/bin:$PATH"
node .devcontainer/setup.cjs
if ! curl --silent --fail http://localhost:3000/api/platform >/dev/null; then
  nohup npm run dev -- --hostname 0.0.0.0 --port 3000 > /tmp/wedinvite-preview.log 2>&1 < /dev/null &
fi
