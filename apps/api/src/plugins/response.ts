import { FastifyPluginAsync } from 'fastify'

declare module 'fastify' {
  interface FastifyReply {
    success: (data?: unknown, meta?: Record<string, unknown> | null) => void
    fail: (
      error: { code?: string; message: string; details?: unknown },
      statusCode?: number
    ) => void
  }
}

const responsePlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorateReply('success', function (this: any, data?: unknown, meta?: Record<string, unknown> | null) {
    const requestId = (this.request as any)?.requestId || null
    const baseMeta = { requestId, timestamp: new Date().toISOString() }
    this.type('application/json')
    this.send({ data: data ?? null, error: null, meta: meta ? { ...baseMeta, ...meta } : baseMeta })
  })

  fastify.decorateReply('fail', function (
    this: any,
    error: { code?: string; message: string; details?: unknown },
    statusCode: number = 400
  ) {
    const requestId = (this.request as any)?.requestId || null
    const payload = {
      data: null,
      error: {
        code: error.code ?? 'ERROR',
        message: error.message,
        details: error.details ?? null
      },
      meta: { requestId, timestamp: new Date().toISOString() }
    }
    this.code(statusCode)
    this.type('application/json')
    this.send(payload)
  })
}

export default responsePlugin

