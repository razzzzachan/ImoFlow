import { FastifyPluginAsync } from 'fastify'

const loggingPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('preHandler', async (req, _reply) => {
    const rid = (req as any).requestId
    fastify.log.info({ req: { method: req.method, url: req.url }, requestId: rid }, 'request:start')
  })

  fastify.addHook('onResponse', async (req, reply) => {
    const rid = (req as any).requestId
    const userId = (req as any).user?.id
    fastify.log.info({ req: { method: req.method, url: req.url }, res: { statusCode: reply.statusCode }, requestId: rid, userId }, 'request:end')
  })
}

export default loggingPlugin

