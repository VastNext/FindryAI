#!/bin/bash
# Request Google Indexing for one or more URLs via the GSC URL Inspection UI,
# driven by opencli browser automation.
#
# Usage:
#   bash scripts/gsc-request-indexing.sh <url> [url2 ...]
#   bash scripts/gsc-request-indexing.sh --check     # verify setup only, submit nothing
#   pnpm gsc:index <url>
#
# Config (real environment wins over .env):
#   GSC_RESOURCE_ID   GSC property, e.g. "sc-domain:findryai.com" or "https://findryai.com/"
#   OPENCLI_SESSION   opencli browser session name (default: gsc)
#
# Prereqs:
#   - opencli CLI installed (`npm i -g @jackwener/opencli`)
#   - the browser session must be logged into a Google account that has GSC
#     access to the property. If not, the script fails with a screenshot of
#     whatever the session shows (typically the Google login page).
#
# UI-language note: the flow matches the ENGLISH GSC strings
# ("REQUEST INDEXING" button, "priority crawl queue" success toast). If your
# GSC UI runs in another language, override GSC_TEXT_REQUEST / GSC_TEXT_SUCCESS.
#
# Quota: GSC allows roughly 10 "request indexing" calls per day per property.
# The script does not track quota; Google rejects excess requests in the UI.

set -u

SESSION="${OPENCLI_SESSION:-gsc}"
TEXT_REQUEST="${GSC_TEXT_REQUEST:-REQUEST INDEXING}"
TEXT_SUCCESS="${GSC_TEXT_SUCCESS:-priority crawl queue}"
SHOTS_DIR="tmp-shots"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"

say() { echo "[$(date +%H:%M:%S)] $*"; }
die() { say "ERROR: $*"; exit 1; }

# --- config: load GSC_RESOURCE_ID / OPENCLI_SESSION from .env if not in env ---
if [ -f "$REPO_ROOT/.env" ]; then
  while IFS= read -r line; do
    case "$line" in
      GSC_RESOURCE_ID=*|OPENCLI_SESSION=*)
        k="${line%%=*}"; v="${line#*=}"
        if [ -z "${!k:-}" ]; then export "$k=$v"; fi
        ;;
    esac
  done < <(grep -E '^(GSC_RESOURCE_ID|OPENCLI_SESSION)=' "$REPO_ROOT/.env" || true)
fi

[ -n "${GSC_RESOURCE_ID:-}" ] || die "GSC_RESOURCE_ID not set. Add GSC_RESOURCE_ID=sc-domain:yourdomain.com to .env"
command -v opencli >/dev/null 2>&1 || die "opencli not found (npm i -g @jackwener/opencli)"
command -v node >/dev/null 2>&1 || die "node not found"

ENC_RESOURCE="$(node -e "console.log(encodeURIComponent(process.argv[1]))" "$GSC_RESOURCE_ID")"
BAR="input[role='combobox'][aria-label*='Inspect any URL']"
SEARCH_BTN="button[aria-label='Search']"

CHECK_ONLY="no"
if [ "${1:-}" = "--check" ]; then
  CHECK_ONLY="yes"
  shift
fi
if [ "$CHECK_ONLY" != "yes" ]; then
  [ $# -ge 1 ] || { echo "usage: $0 [--check] <url> [url...]"; exit 1; }
fi
for url in "$@"; do
  case "$url" in https://*) ;; *) die "URL must start with https:// : $url" ;; esac
done

# --- helpers -----------------------------------------------------------------
get_ref() {
  # print the ref of the "Request indexing" div[role=button] (empty if absent)
  opencli browser "$SESSION" find --text "Request indexing" --limit 6 2>/dev/null \
   | node -e "
let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{
  try{const j=JSON.parse(d);
    const c=(j.entries||[]).filter(e=>e.tag==='div'&&e.role==='button'&&/request/i.test(e.text||''));
    console.log(c.length?c[c.length-1].ref:'');
  }catch(e){console.log('');}
});"
}

toast_ok() {
  opencli browser "$SESSION" find --text "$TEXT_SUCCESS" --limit 3 2>/dev/null \
   | node -e "
let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{
  try{const j=JSON.parse(d);console.log((j.matches_n||0)>0?'YES':'NO');}catch(e){console.log('NO');}
});"
}

# --- init: open GSC property, confirm session works ---------------------------
say "opening GSC property $GSC_RESOURCE_ID (session: $SESSION)"
opencli browser "$SESSION" open "https://search.google.com/search-console?resource_id=$ENC_RESOURCE" >/dev/null 2>&1
sleep 10
if ! opencli browser "$SESSION" wait selector "$BAR" --timeout 60 >/dev/null 2>&1; then
  opencli browser "$SESSION" screenshot "$SHOTS_DIR/gsc-setup-fail.png" >/dev/null 2>&1
  die "GSC inspection bar not found — see $SHOTS_DIR/gsc-setup-fail.png (login? wrong property? no access?)"
fi
say "GSC ready"

if [ "$CHECK_ONLY" = "yes" ]; then
  say "check passed: session '$SESSION' is logged in and property is accessible. Nothing submitted."
  exit 0
fi

# --- per-URL submission (recipe proven 2026-10-10, 7/7) ------------------------
# The top-bar combobox ignores synthetic Enter/ArrowDown; the reliable trigger
# is clicking the Search button next to it after typing the URL.
FAILS=0
for url in "$@"; do
  slug="${url##*/}"
  say "=== START $url"

  opencli browser "$SESSION" type "$BAR" "$url" 2>/dev/null | grep -q '"typed": true' \
    || { say "FAIL type failed for $url"; FAILS=$((FAILS+1)); continue; }
  opencli browser "$SESSION" click "$SEARCH_BTN" 2>/dev/null | grep -q '"clicked": true' \
    || { say "FAIL search-click failed for $url"; FAILS=$((FAILS+1)); continue; }
  sleep 8

  if ! opencli browser "$SESSION" wait text "$slug" --timeout 90 >/dev/null 2>&1; then
    say "WARN inspection panel switch not confirmed for $slug (continuing)"
  fi
  if ! opencli browser "$SESSION" wait text "$TEXT_REQUEST" --timeout 90 >/dev/null 2>&1; then
    say "WARN no $TEXT_REQUEST button appeared for $slug"
  fi
  sleep 3

  ref="$(get_ref)"
  [ -n "$ref" ] || { say "FAIL request-button not found for $slug"; FAILS=$((FAILS+1)); continue; }
  opencli browser "$SESSION" click "$ref" >/dev/null 2>&1 || { say "FAIL click failed for $slug"; FAILS=$((FAILS+1)); continue; }
  say "request clicked (ref=$ref), waiting for live test + success toast..."

  ok="NO"
  for i in 1 2 3 4 5 6; do
    sleep 40
    ok="$(toast_ok)"
    [ "$ok" = "YES" ] && break
    ref2="$(get_ref)"
    if [ -n "$ref2" ]; then
      # some runs show a confirm button after the live test; click it once more
      opencli browser "$SESSION" click "$ref2" >/dev/null 2>&1 && say "confirm click sent (ref=$ref2)"
    fi
  done

  if [ "$ok" = "YES" ]; then
    say "=== SUCCESS $url (added to priority crawl queue)"
  else
    opencli browser "$SESSION" screenshot "$SHOTS_DIR/gsc-fail-$slug.png" >/dev/null 2>&1
    say "=== FAIL(?) $url — no success toast; screenshot: $SHOTS_DIR/gsc-fail-$slug.png"
    FAILS=$((FAILS+1))
  fi
  sleep 10
done

say "ALL DONE: $(( $# - FAILS ))/$# submitted, $FAILS failed"
exit $(( FAILS > 0 ? 1 : 0 ))
