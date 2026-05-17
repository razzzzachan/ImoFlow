// @ts-nocheck
const cronSecret = process.env.CRON_SECRET

function jsonSuccess(res, data, meta) {
  return res.status(200).json({ data, error: null, meta: meta || null })
}

function jsonError(res, statusCode, code, message, details) {
  return res.status(statusCode).json({
    data: null,
    error: {
      code,
      message,
      details: details ?? null,
    },
    meta: null,
  })
}

function isAuthorizedCron(req) {
  if (!cronSecret) {
    return false
  }

  const authHeader = req.headers['authorization'] || req.headers['Authorization']
  const bearerToken = typeof authHeader === 'string' ? authHeader.replace(/^Bearer\s+/i, '').trim() : ''
  const headerToken = typeof req.headers['x-cron-secret'] === 'string' ? req.headers['x-cron-secret'].trim() : ''

  return bearerToken === cronSecret || headerToken === cronSecret
}

function resolveBackendBaseUrl() {
  const candidate = (
    process.env.VITE_API_URL
    || process.env.API_URL
    || process.env.BACKEND_API_URL
    || ''
  ).trim()

  if (!candidate) {
    return ''
  }

  try {
    return new URL(candidate).origin
  } catch {
    return candidate.replace(/\/+$/, '')
  }
}

function readPositiveInt(value, fallbackValue) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) {
    return fallbackValue
  }

  return Math.max(1, Math.min(30, Math.round(parsed)))
}

function readWindowDays(req) {
  const queryValue = Array.isArray(req.query?.window_days) ? req.query.window_days[0] : req.query?.window_days
  return readPositiveInt(queryValue, readPositiveInt(process.env.MARKETING_HEARTBEAT_WINDOW_DAYS, 7))
}

async function parsePayload(response) {
  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return response.json()
  }

  const text = await response.text()
  return {
    data: null,
    error: {
      code: 'invalid_backend_response',
      message: text || 'Resposta invalida do backend principal.',
      details: null,
    },
    meta: null,
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return jsonError(res, 405, 'method_not_allowed', 'Metodo nao suportado')
  }

  if (!isAuthorizedCron(req)) {
    return jsonError(res, 401, 'unauthorized_cron', 'Cron nao autorizado')
  }

  const backendBaseUrl = resolveBackendBaseUrl()
  if (!backendBaseUrl) {
    return jsonError(res, 500, 'backend_not_configured', 'Endpoint principal da API nao configurado.')
  }

  try {
    const windowDays = readWindowDays(req)
    const targetUrl = new URL('/api/marketing/acquisition-heartbeat/cron', `${backendBaseUrl.replace(/\/$/, '')}/`)
    targetUrl.searchParams.set('window_days', String(windowDays))

    const authHeader = typeof req.headers['authorization'] === 'string'
      ? req.headers['authorization']
      : `Bearer ${cronSecret}`
    const headerToken = typeof req.headers['x-cron-secret'] === 'string'
      ? req.headers['x-cron-secret']
      : cronSecret

    const response = await fetch(targetUrl.toString(), {
      method: 'GET',
      headers: {
        Authorization: authHeader,
        'x-cron-secret': headerToken,
      },
    })

    const payload = await parsePayload(response)
    return res.status(response.status).json(payload)
  } catch (error) {
    console.error('Erro em /api/marketing/acquisition-heartbeat-cron:', error)
    return jsonError(
      res,
      500,
      'marketing_acquisition_heartbeat_cron_failed',
      error?.message || 'Erro ao executar heartbeat de aquisicao',
    )
  }
}