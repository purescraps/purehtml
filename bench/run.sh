#!/bin/sh
# Runs a benchmark command, appending the inputs selected through the
# environment (normally set by the Makefile):
#
#   HTML, CONFIG  the HTML document and YAML config to benchmark
#   ITERATIONS    extractions to run
#   URL           base URL passed to the extractor
#   BENCH_CWD     directory that relative paths are resolved against
#   BENCH_LOG     when set, the output is also kept in this file
#
# Usage: run.sh COMMAND [ARG]...
set -eu

base=${BENCH_CWD:-$PWD}

abspath() {
  case $1 in
    /*) printf '%s\n' "$1" ;;
    *) printf '%s\n' "$base/$1" ;;
  esac
}

die() {
  echo "bench: $*" >&2
  exit 2
}

[ -z "${ITERATIONS:-}" ] || set -- "$@" --iterations "$ITERATIONS"
[ -z "${URL:-}" ] || set -- "$@" --url "$URL"

if [ -n "${HTML:-}" ] || [ -n "${CONFIG:-}" ]; then
  [ -n "${HTML:-}" ] && [ -n "${CONFIG:-}" ] || die "HTML and CONFIG must be set together"
  set -- "$@" "$(abspath "$HTML")" "$(abspath "$CONFIG")"
fi

if [ -n "${BENCH_LOG:-}" ]; then
  # Keep the output for save.py while still reporting the benchmark's status.
  status=0
  "$@" >"$BENCH_LOG" 2>&1 || status=$?
  cat "$BENCH_LOG"
  exit "$status"
fi

exec "$@"
