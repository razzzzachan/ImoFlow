# API Response Envelopes (MVP)

All JSON responses follow the same envelope for consistency across modules (CRM, Bots, WhatsApp, AI):

Success
{
  "data": { ... },
  "error": null,
  "meta": {
    "requestId": "<uuid>",
    "timestamp": "2025-01-01T12:34:56.000Z"
  }
}

Failure
{
  "data": null,
  "error": {
    "message": "Human-friendly message",
    "details": { /* optional validation info (e.g., zod issues) */ }
  },
  "meta": {
    "requestId": "<uuid>",
    "timestamp": "2025-01-01T12:34:56.000Z"
  }
}

Notes
- Use reply.success(payload, statusCode?) and reply.fail({ message, details? }, statusCode)
- Prefer 4xx for client errors (validation, not found) and 5xx for server errors
- Avoid leaking sensitive internals into error.details
- Logging includes method, url, statusCode, requestId, userId
- Metrics should increment counters with minimal labels to keep cardinality low

Examples
- cURL success (bots stats):
  curl -H "Authorization: Bearer $TOKEN" \
       -s http://localhost:3000/api/bots/bots/<id>/stats | jq

- cURL validation error (bots create sem name):
  curl -H "Authorization: Bearer $TOKEN" \
       -H "Content-Type: application/json" \
       -d '{"description":"x"}' \
       -s http://localhost:3000/api/bots/bots | jq


- cURL not found (bot inexistente):
  curl -H "Authorization: Bearer $TOKEN" \
       -s http://localhost:3000/api/bots/bots/bot-inexistente/stats | jq

- Exemplo de details com Zod (erro de validação):
  {
    "data": null,
    "error": {
      "code": "ERROR",
      "message": "Invalid request",
      "details": [
        {
          "code": "invalid_type",
          "expected": "string",
          "received": "undefined",
          "path": ["name"],
          "message": "Required"
        }
      ]
    },
    "meta": {
      "requestId": "...",
      "timestamp": "..."
    }
  }


Running smoke tests
- Windows (PowerShell):
  - Set-Item -Path Env:API_TOKEN -Value "<SEU_TOKEN>"
  - npm run smoke
- Linux/Mac (bash):
  - export API_TOKEN="<SEU_TOKEN>"
  - export BASE_URL="http://localhost:3000" # opcional
  - npm run smoke:sh
