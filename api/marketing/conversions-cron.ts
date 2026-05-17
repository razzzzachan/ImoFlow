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

function readPositiveInt(name, fallback) {
  const parsed = Number(process.env[name])
  if (!Number.isFinite(parsed)) return fallback
  return Math.max(1, Math.min(100, Math.round(parsed)))
}

function readLimit(req) {
  const queryValue = Array.isArray(req.query?.limit) ? req.query.limit[0] : req.query?.limit
  const parsedQuery = Number(queryValue)

  if (Number.isFinite(parsedQuery) && parsedQuery > 0) {
    return Math.max(1, Math.min(100, Math.round(parsedQuery)))
  }

  return readPositiveInt('MARKETING_CONVERSIONS_CRON_LIMIT', 25)
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
      message: text || 'Resposta inválida do backend principal.',
      details: null,
    },
    meta: null,
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return jsonError(res, 405, 'method_not_allowed', 'Método não suportado')
  }

  if (!isAuthorizedCron(req)) {
    return jsonError(res, 401, 'unauthorized_cron', 'Cron não autorizado')
  }

  const backendBaseUrl = resolveBackendBaseUrl()
  if (!backendBaseUrl) {
    return jsonError(res, 500, 'backend_not_configured', 'Endpoint principal da API não configurado.')
  }

  try {
    const limit = readLimit(req)
    const targetUrl = new URL('/api/marketing/conversions/flush/cron', `${backendBaseUrl.replace(/\/$/, '')}/`)
    targetUrl.searchParams.set('limit', String(limit))

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
    console.error('Erro em /api/marketing/conversions-cron:', error)
    return jsonError(
      res,
      500,
      'marketing_conversions_cron_failed',
      error?.message || 'Erro ao executar cron de conversões do Google Ads'
    )
  }
}