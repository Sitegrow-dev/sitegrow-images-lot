#!/usr/bin/env bash
# Links the commands into ~/.local/bin (must be on your PATH).
set -euo pipefail
HERE=$(cd "$(dirname "$0")" && pwd)
mkdir -p ~/.local/bin
for c in images-lot image-codex image-ralph; do ln -sf "$HERE/bin/$c" ~/.local/bin/$c; echo "~/.local/bin/$c -> $HERE/bin/$c"; done
command -v codex >/dev/null || echo "Codex CLI not found: install it and run 'codex login'."
