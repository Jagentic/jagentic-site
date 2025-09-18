#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
QUIZMASTER="$ROOT/quizmaster"
WEB_DIR="$ROOT/web"

echo "[Quizmaster] Validating packs..."
python3 "$QUIZMASTER/tools/validate.py"

echo "[Quizmaster] Building compiled packs..."
python3 "$QUIZMASTER/tools/build_pack.py"

PORT=$(python3 - <<'PY'
import socket
candidates = (8080, 8081)
for port in candidates:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        if sock.connect_ex(("127.0.0.1", port)) != 0:
            print(port)
            break
else:
    raise SystemExit(1)
PY
) || {
  echo "[Server] Could not bind to port 8080 or 8081."
  exit 1
}

echo "[Server] Starting local preview at http://localhost:${PORT}"
echo "[Server] Open http://localhost:${PORT}/?mode=biz"
echo "[Server] Open http://localhost:${PORT}/?mode=buzz"

cd "$WEB_DIR"
python3 -m http.server "$PORT"
