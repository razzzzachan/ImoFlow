import { FastifyPluginAsync } from 'fastify'
import client from 'prom-client'

const metricsPlugin: FastifyPluginAsync = async (fastify) => {
  const register = new client.Registry()

  client.collectDefaultMetrics({ register })

  const httpRequests = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'HTTP request duration histogram',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.05, 0.1, 0.25, 0.5, 1, 2, 5]
  })

  register.registerMetric(httpRequests)

  fastify.addHook('onResponse', async (req, reply) => {
    const route = (reply as any).context?.config?.url || req.routerPath || req.url
    const status = reply.statusCode
    const method = req.method
    const start = (req as any).startTime as number | undefined
    if (typeof start === 'number') {
      const duration = (Date.now() - start) / 1000
      httpRequests.observe({ method, route, status_code: String(status) }, duration)
    }
  })

  fastify.addHook('onRequest', async (req) => {
    ;(req as any).startTime = Date.now()
  })

  fastify.get('/metrics', async (_req, reply) => {
    // Protege em produção caso necessário via env
    if (process.env.METRICS_PROTECTED === 'true' && process.env.NODE_ENV === 'production') {
      return reply.code(403).send('Metrics disabled in production')
    }
    reply.header('Content-Type', register.contentType)
    return register.metrics()
  })
}

export default metricsPlugin

