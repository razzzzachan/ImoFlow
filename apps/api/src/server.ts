import Fastify from 'fastify'
import cors from '@fastify/cors'
import multipart from '@fastify/multipart'
import jwt from '@fastify/jwt'
import env from '@fastify/env'
import { config } from 'dotenv'

// Carregar variáveis de ambiente
config()

const schema = {
  type: 'object',
  required: ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'OPENAI_API_KEY', 'JWT_SECRET'],
  properties: {
    SUPABASE_URL: { type: 'string' },
    SUPABASE_ANON_KEY: { type: 'string' },
    SUPABASE_SERVICE_ROLE_KEY: { type: 'string' },
    OPENAI_API_KEY: { type: 'string' },
    JWT_SECRET: { type: 'string' },
    API_PORT: { type: 'string', default: '3001' },
    API_HOST: { type: 'string', default: 'localhost' }
  }
}

const fastify = Fastify({
  logger: {
    level: 'info',
    transport: {
      target: 'pino-pretty'
    }
  }
})

async function start() {
  try {
    // Registrar plugins
    await fastify.register(env, {
      schema,
      dotenv: true
    })

    await fastify.register(cors, {
      origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
      credentials: true
    })

    await fastify.register(multipart)

    await fastify.register(jwt, {
      secret: process.env.JWT_SECRET!
    })

    // Rota de health check
    fastify.get('/health', async () => {
      return { status: 'ok', timestamp: new Date().toISOString() }
    })

    // Registrar rotas dos módulos
    await fastify.register(import('../../modules/auth/routes'), { prefix: '/api/auth' })
    await fastify.register(import('../../modules/crm/routes'), { prefix: '/api/crm' })
    await fastify.register(import('../../modules/ai/routes'), { prefix: '/api/ai' })
    await fastify.register(import('../../modules/whatsapp/routes'), { prefix: '/api/whatsapp' })
    await fastify.register(import('../../modules/bots/routes'), { prefix: '/api/bots' })

    const port = parseInt(process.env.API_PORT || '3001')
    const host = process.env.API_HOST || 'localhost'

    await fastify.listen({ port, host })
    console.log(`🚀 Servidor rodando em http://${host}:${port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
