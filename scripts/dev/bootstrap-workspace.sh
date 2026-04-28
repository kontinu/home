#!/usr/bin/env sh
set -eu

STORE_DIR="${PNPM_STORE_DIR:-/pnpm/store}"
LOCKFILE="pnpm-lock.yaml"
MODULES_STATE="node_modules/.modules.yaml"
INSTALL_LOCK_DIR="node_modules/.pnpm-install-lock"
WAIT_INTERVAL="${BOOTSTRAP_WAIT_INTERVAL:-1}"

mkdir -p node_modules "$STORE_DIR"

needs_install() {
  [ ! -f "$MODULES_STATE" ] || [ "$LOCKFILE" -nt "$MODULES_STATE" ]
}

release_lock() {
  rmdir "$INSTALL_LOCK_DIR" 2>/dev/null || true
}

if needs_install; then
  while needs_install; do
    if mkdir "$INSTALL_LOCK_DIR" 2>/dev/null; then
      trap release_lock EXIT INT TERM HUP
      pnpm install --frozen-lockfile --store-dir "$STORE_DIR"
      release_lock
      trap - EXIT INT TERM HUP
      break
    fi

    sleep "$WAIT_INTERVAL"
  done
fi

exec "$@"
