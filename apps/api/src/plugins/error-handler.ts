import { FastifyPluginAsync } from 'fastify'
import { ZodError } from 'zod'

const errorHandlerPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.setErrorHandler((err, _req, reply) => {
    if (err instanceof ZodError) {
      return reply.fail(
        {
          code: 'VALIDATION_ERROR',
          message: 'Houve erro de validação nos dados enviados.',
          details: err.flatten()
        },
        400
      )
    }

    const status = (err as any).statusCode || 500
    const message = err.message || 'Erro interno do servidor'

    return reply.fail(
      {
        code: status >= 500 ? 'INTERNAL_ERROR' : 'REQUEST_ERROR',
        message
      },
      status
    )
  })
}

export default errorHandlerPlugin

