#!/usr/bin/env sh
set -eu

ROOT_DIR=$(CDPATH= cd -- "$(dirname "$0")/../.." && pwd)
HOME_DIR="${SANITY_STUDIO_HOME:-$ROOT_DIR/.config/home}"
XDG_CONFIG_DIR="${SANITY_STUDIO_XDG_CONFIG_HOME:-$ROOT_DIR/.config/xdg}"
XDG_CACHE_DIR="${SANITY_STUDIO_XDG_CACHE_HOME:-$ROOT_DIR/.config/cache}"

mkdir -p "$HOME_DIR" "$XDG_CONFIG_DIR" "$XDG_CACHE_DIR"

export HOME="$HOME_DIR"
export XDG_CONFIG_HOME="$XDG_CONFIG_DIR"
export XDG_CACHE_HOME="$XDG_CACHE_DIR"

cd "$ROOT_DIR/apps/studio"
exec "$@"
