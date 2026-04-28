#!/usr/bin/env sh
set -eu

STORE_DIR="${PNPM_STORE_DIR:-/pnpm/store}"
LOCKFILE="pnpm-lock.yaml"
MODULES_STATE="node_modules/.modules.yaml"

mkdir -p node_modules "$STORE_DIR"

if [ ! -f "$MODULES_STATE" ] || [ "$LOCKFILE" -nt "$MODULES_STATE" ]; then
  pnpm install --frozen-lockfile --store-dir "$STORE_DIR"
fi

exec "$@"
