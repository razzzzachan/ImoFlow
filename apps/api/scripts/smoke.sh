#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000}"
API_TOKEN="${API_TOKEN:-}"

if [[ -z "${API_TOKEN}" ]]; then
  echo "ERROR: Set API_TOKEN environment variable." >&2
  exit 1
fi

call() {
  local method="$1"; shift
  local path="$1"; shift
  local body="${1:-}"
  local url="${BASE_URL}${path}"
  if [[ -n "$body" ]]; then
    curl -sS -X "$method" "$url" \
      -H "Authorization: Bearer ${API_TOKEN}" \
      -H "Content-Type: application/json" \
      -d "$body"
  else
    curl -sS -X "$method" "$url" \
      -H "Authorization: Bearer ${API_TOKEN}"
  fi
}

test_envelope() {
  local json="$1"
  echo "$json" | grep -q '"meta"' || return 1
  echo "$json" | grep -q '"data"' || echo "$json" | grep -q '"error"' || return 1
  return 0
}

failures=0

echo "-> Bots: List (GET /api/bots/bots)"
resp=$(call GET "/api/bots/bots" || true)
if test_envelope "$resp"; then
  echo "   OK envelope"
else
  echo "   Invalid envelope: $resp" >&2
  failures=$((failures+1))
fi

echo "-> CRM: Stats (GET /api/crm/stats)"
resp=$(call GET "/api/crm/stats" || true)
if test_envelope "$resp"; then
  echo "   OK envelope"
else
  echo "   Invalid envelope: $resp" >&2
  failures=$((failures+1))
fi

echo "-> WhatsApp: Status (GET /api/whatsapp/status)"
resp=$(call GET "/api/whatsapp/status" || true)
if test_envelope "$resp"; then
  echo "   OK envelope"
else
  echo "   Invalid envelope: $resp" >&2
  failures=$((failures+1))
fi

if [[ "$failures" -gt 0 ]]; then
  echo "Smoke tests completed with $failures failure(s)." >&2
  exit 1
else
  echo "Smoke tests passed."
fi

