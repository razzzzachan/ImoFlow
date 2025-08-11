import { FastifyPluginAsync } from 'fastify'
import { randomUUID } from 'crypto'

const requestIdPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('onRequest', async (req, reply) => {
    const rid = req.headers['x-request-id']?.toString() || randomUUID()
    // @ts-ignore attach to request for logs
    req.requestId = rid
    reply.header('x-request-id', rid)
  })

  fastify.addHook('onResponse', async (req, reply) => {
    if (reply.getHeader('x-request-id')) return
    // garante que toda resposta contenha o header
    // @ts-ignore
    if (req.requestId) reply.header('x-request-id', req.requestId)
  })
}

export default requestIdPlugin

