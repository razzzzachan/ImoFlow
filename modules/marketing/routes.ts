import '../fastify-augment'

import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { PUBLIC_MARKETING_TOUCHPOINT_EVENTS, shouldQueuePublicMarketingConversionEvent } from './conversions'

import {
  captureMarketingTouchpoint,
  flushPendingMarketingConversionEvents,
  queueMarketingConversionEvent,
  readMarketingOverview,
} from './service'
import {
  readLatestMarketingAcquisitionHeartbeat,
  runMarketingAcquisitionHeartbeat,
} from './heartbeat'

const publicTrackSchema = z.object({
  event_type: z.enum(PUBLIC_MARKETING_TOUCHPOINT_EVENTS),
  anonymous_id: z.string().min(1).max(120).optional(),
  page_path: z.string().min(1).max(500).optional(),
  target: z.string().min(1).max(1000).optional(),
  event_time: z.string().datetime().optional(),
  attribution: z.record(z.string()).optional(),
})

const flushSchema = z.object({
  limit: z.number().int().min(1).max(100).optional(),
})

const flushCronQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional(),
})

const overviewQuerySchema = z.object({
  days: z.coerce.number().int().min(1).max(90).optional(),
  recent_limit: z.coerce.number().int().min(1).max(25).optional(),
})

const heartbeatCronQuerySchema = z.object({
  window_days: z.coerce.number().int().min(1).max(30).optional(),
})

function isAuthorizedCron(request: any) {
  const cronSecret = String(process.env.CRON_SECRET || '').trim()
  if (!cronSecret) {
    return false
  }

  const authHeader = request.headers?.authorization || request.headers?.Authorization
  const bearerToken = typeof authHeader === 'string'
    ? authHeader.replace(/^Bearer\s+/i, '').trim()
    : ''
  const headerToken = typeof request.headers?.['x-cron-secret'] === 'string'
    ? request.headers['x-cron-secret'].trim()
    : ''

  return bearerToken === cronSecret || headerToken === cronSecret
}

function safeSuccess(reply: any, data?: unknown) {
  const requestId = (reply.request as any)?.requestId || null
  return reply.send({
    data: data ?? null,
    error: null,
    meta: { requestId, timestamp: new Date().toISOString() },
  })
}

function safeFail(reply: any, message: string, statusCode: number = 400, details?: unknown) {
  const requestId = (reply.request as any)?.requestId || null
  reply.code(statusCode)
  return reply.send({
    data: null,
    error: {
      code: 'MARKETING_ERROR',
      message,
      details: details ?? null,
    },
    meta: { requestId, timestamp: new Date().toISOString() },
  })
}

export default async function marketingRoutes(fastify: FastifyInstance) {
  fastify.post('/track', async (request, reply) => {
    const parsed = publicTrackSchema.safeParse(request.body)
    if (!parsed.success) {
      return safeFail(reply, 'Payload inválido para tracking de marketing', 400, parsed.error.flatten())
    }

    try {
      const payload = parsed.data

      await captureMarketingTouchpoint({
        source: 'public_track',
        eventType: payload.event_type,
        anonymousId: payload.anonymous_id,
        pagePath: payload.page_path,
        target: payload.target,
        occurredAt: payload.event_time,
        attribution: payload.attribution,
      })

      const conversionEvent = shouldQueuePublicMarketingConversionEvent(payload.event_type)
        ? await queueMarketingConversionEvent({
            eventType: payload.event_type,
            source: 'public_track',
            anonymousId: payload.anonymous_id,
            pagePath: payload.page_path,
            target: payload.target,
            eventTime: payload.event_time,
            attribution: payload.attribution,
            dispatchNow: true,
          })
        : null

      return safeSuccess(reply, {
        tracked: true,
        conversionEventId: conversionEvent?.id || null,
      })
    } catch (error: any) {
      return safeFail(reply, 'Erro ao registrar evento de marketing', 500, error?.message || null)
    }
  })

  fastify.post('/conversions/flush', {
    preHandler: [fastify.authenticate, fastify.requireRole(['admin', 'gestor'])],
  }, async (request, reply) => {
    const parsed = flushSchema.safeParse(request.body || {})
    if (!parsed.success) {
      return safeFail(reply, 'Payload inválido para flush de conversões', 400, parsed.error.flatten())
    }

    try {
      const summary = await flushPendingMarketingConversionEvents(parsed.data.limit)
      return safeSuccess(reply, summary)
    } catch (error: any) {
      return safeFail(reply, 'Erro ao processar fila de conversões', 500, error?.message || null)
    }
  })

  fastify.get('/conversions/flush/cron', async (request, reply) => {
    if (!isAuthorizedCron(request)) {
      return safeFail(reply, 'Cron não autorizado para flush de conversões', 401)
    }

    const parsed = flushCronQuerySchema.safeParse(request.query || {})
    if (!parsed.success) {
      return safeFail(reply, 'Query inválida para flush de conversões', 400, parsed.error.flatten())
    }

    try {
      const summary = await flushPendingMarketingConversionEvents(parsed.data.limit)
      return safeSuccess(reply, summary)
    } catch (error: any) {
      return safeFail(reply, 'Erro ao processar fila de conversões via cron', 500, error?.message || null)
    }
  })

  fastify.get('/overview', {
    preHandler: [fastify.authenticate, fastify.requireRole(['admin'])],
  }, async (request, reply) => {
    const parsed = overviewQuerySchema.safeParse(request.query || {})
    if (!parsed.success) {
      return safeFail(reply, 'Query inválida para overview de marketing', 400, parsed.error.flatten())
    }

    try {
      const overview = await readMarketingOverview({
        windowDays: parsed.data.days,
        recentLimit: parsed.data.recent_limit,
      })

      return safeSuccess(reply, overview)
    } catch (error: any) {
      return safeFail(reply, 'Erro ao carregar overview de marketing', 500, error?.message || null)
    }
  })

  fastify.get('/acquisition-heartbeat/latest', {
    preHandler: [fastify.authenticate, fastify.requireRole(['admin'])],
  }, async (_request, reply) => {
    try {
      const heartbeat = await readLatestMarketingAcquisitionHeartbeat()
      return safeSuccess(reply, { heartbeat })
    } catch (error: any) {
      return safeFail(reply, 'Erro ao carregar heartbeat de aquisição', 500, error?.message || null)
    }
  })

  fastify.get('/acquisition-heartbeat/cron', async (request, reply) => {
    if (!isAuthorizedCron(request)) {
      return safeFail(reply, 'Cron não autorizado para heartbeat de aquisição', 401)
    }

    const parsed = heartbeatCronQuerySchema.safeParse(request.query || {})
    if (!parsed.success) {
      return safeFail(reply, 'Query inválida para heartbeat de aquisição', 400, parsed.error.flatten())
    }

    try {
      const heartbeat = await runMarketingAcquisitionHeartbeat({
        windowDays: parsed.data.window_days,
        runType: 'daily',
      })

      return safeSuccess(reply, { heartbeat })
    } catch (error: any) {
      return safeFail(reply, 'Erro ao executar heartbeat de aquisição', 500, error?.message || null)
    }
  })
}