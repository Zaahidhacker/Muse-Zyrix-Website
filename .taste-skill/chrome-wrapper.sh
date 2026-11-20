#!/bin/sh
# Wrapper for the taste-skill checkers: chrome-headless-shell rejects
# --headless=new, and this VM runs as root so --no-sandbox is required.
SHELL=/home/hatch/.pw-browsers/chromium_headless_shell-1255/chrome-headless-shell-linux64/chrome-headless-shell
out=""
for a in "$@"; do
  case "$a" in
    --headless=new) a="--headless" ;;
  esac
  out="$out $a"
done
# Args contain no spaces; unquoted expansion is intentional here.
# shellcheck disable=SC2086
exec $SHELL --no-sandbox $out
