#!/bin/bash
# Request Google Indexing for one or more URLs via GSC URL Inspection UI,
# driven by opencli browser automation with rock-solid DOM event dispatching.
#
# Usage:
#   bash scripts/gsc-request-indexing.sh <url> [url2 ...]
#   bash scripts/gsc-request-indexing.sh --check
#   pnpm gsc:index <url>

set -u

SESSION="${OPENCLI_SESSION:-gsc}"
SHOTS_DIR="tmp-shots"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"

say() { echo "[$(date +%H:%M:%S)] $*"; }
die() { say "ERROR: $*"; exit 1; }

# Load GSC_RESOURCE_ID from .env
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

[ -n "${GSC_RESOURCE_ID:-}" ] || die "GSC_RESOURCE_ID not set in .env"
command -v opencli >/dev/null 2>&1 || die "opencli not found"
command -v node >/dev/null 2>&1 || die "node not found"

ENC_RESOURCE="$(node -e "console.log(encodeURIComponent(process.argv[1]))" "$GSC_RESOURCE_ID")"

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

say "Opening GSC property $GSC_RESOURCE_ID (session: $SESSION)..."
opencli browser "$SESSION" open "https://search.google.com/search-console?resource_id=$ENC_RESOURCE" >/dev/null 2>&1
sleep 10

# Verify input search bar is available
CHECK_BAR="$(opencli browser "$SESSION" eval '(() => {
  const input = document.querySelector("input[aria-label*=\"Inspect any URL\"]");
  return input ? "ok" : "no";
})()' 2>/dev/null | grep -o 'ok' || true)"

if [ "$CHECK_BAR" != "ok" ]; then
  mkdir -p "$SHOTS_DIR"
  opencli browser "$SESSION" screenshot "$SHOTS_DIR/gsc-setup-fail.png" >/dev/null 2>&1
  die "GSC inspection bar not found — see $SHOTS_DIR/gsc-setup-fail.png"
fi

say "GSC session ready."
if [ "$CHECK_ONLY" = "yes" ]; then
  say "Check passed. Nothing submitted."
  exit 0
fi

PASSED=0
TOTAL=$#

for url in "$@"; do
  slug="${url##*/}"
  say "=== START $url"

  # 1. Reload GSC home page fresh
  opencli browser "$SESSION" open "https://search.google.com/search-console?resource_id=$ENC_RESOURCE" >/dev/null 2>&1
  sleep 8

  # 2. Trigger inspection via robust DOM events
  say "Typing URL and triggering search..."
  TRIGGER_RES="$(opencli browser "$SESSION" eval "(() => {
    const input = document.querySelector('input[aria-label*=\"Inspect any URL\"]');
    if (!input) return 'no_input';
    input.focus();
    input.value = '$url';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    const form = input.closest('form') || document.querySelector('form[role=\"search\"]');
    const btns = form ? Array.from(form.querySelectorAll('button')) : [];
    const searchBtn = btns.find(b => b.getAttribute('aria-label') === 'Search') || document.querySelector('button[aria-label=\"Search\"]');
    if (searchBtn) {
      searchBtn.click();
      return 'ok';
    }
    return 'no_btn';
  })()" 2>/dev/null | grep -o 'ok' || true)"

  if [ "$TRIGGER_RES" != "ok" ]; then
    say "FAIL: could not trigger inspection for $slug"
    continue
  fi

  # 3. Wait for panel to load (15-20s)
  say "Waiting for inspection panel to load..."
  sleep 18

  # 4. Find and click REQUEST INDEXING
  CLICKED="no"
  for retry in 1 2 3 4 5; do
    REQ_CLICK="$(opencli browser "$SESSION" eval '(() => {
      const btns = Array.from(document.querySelectorAll("div[role=\"button\"], button"));
      const reqBtn = btns.find(b => /request indexing/i.test(b.innerText || b.textContent || "") && b.offsetParent !== null);
      if (reqBtn) {
        reqBtn.click();
        return "ok";
      }
      return "no";
    })()' 2>/dev/null | grep -o 'ok' || true)"

    if [ "$REQ_CLICK" = "ok" ]; then
      CLICKED="yes"
      say "Clicked REQUEST INDEXING button"
      break
    fi
    sleep 3
  done

  if [ "$CLICKED" != "yes" ]; then
    say "FAIL: REQUEST INDEXING button not found for $slug"
    continue
  fi

  # 5. Wait for live test to complete (polling up to 120s)
  say "Waiting for live URL test and confirmation dialog..."
  SUBMITTED="no"
  for poll in $(seq 1 24); do
    sleep 5
    STATUS="$(opencli browser "$SESSION" eval '(() => {
      const allText = document.body.innerText;
      if (/quota/i.test(allText) && /exceeded/i.test(allText)) {
        return "quota";
      }
      const dialogs = Array.from(document.querySelectorAll("div[role=\"dialog\"], div[role=\"alertdialog\"]"));
      for (const d of dialogs) {
        const t = d.innerText || d.textContent || "";
        if (/Indexing requested/i.test(t) || /priority crawl queue/i.test(t)) {
          const dismiss = Array.from(d.querySelectorAll("button, div[role=\"button\"]")).find(b => /dismiss|got it/i.test(b.innerText || ""));
          if (dismiss) dismiss.click();
          return "success";
        }
      }
      return "waiting";
    })()' 2>/dev/null | grep -oE '(success|quota)' || true)"

    if [ "$STATUS" = "success" ]; then
      SUBMITTED="yes"
      say "SUCCESS: Indexing requested for $url (queue priority added)"
      PASSED=$((PASSED + 1))
      break
    fi

    if [ "$STATUS" = "quota" ]; then
      say "WARN: GSC Daily Quota Exceeded! Google has capped submissions for today."
      exit 0
    fi
  done

  if [ "$SUBMITTED" != "yes" ]; then
    say "TIMEOUT: live test did not return success for $slug within 120s"
  fi

  sleep 3
done

say "========================================="
say "GSC Submission Finished: $PASSED/$TOTAL submitted successfully."
say "========================================="
