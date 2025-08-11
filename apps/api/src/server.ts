import Fastify from 'fastify'
import cors from '@fastify/cors'
import multipart from '@fastify/multipart'
import jwt from '@fastify/jwt'
import env from '@fastify/env'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import { config } from 'dotenv'
import path from 'path'
import responsePlugin from './plugins/response'
import requestIdPlugin from './plugins/request-id'
import errorHandlerPlugin from './plugins/error-handler'
import metricsPlugin from './plugins/metrics'
import crmMetricsPlugin from './plugins/metrics-crm'
import loggingPlugin from './plugins/logging'

// Carregar variáveis de ambiente do arquivo .env na raiz do projeto
config({ path: path.resolve(process.cwd(), '.env') })

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
  logger: process.env.NODE_ENV === 'development' ? {
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true
      }
    }
  } : true
})

async function start() {
  try {
    // Registrar plugins
    await fastify.register(env, {
      schema,
      dotenv: true
    })

    await fastify.register(cors, {
      origin: (origin, cb) => {
        const defaults = ['http://localhost:3000', 'http://127.0.0.1:3000']
        const envOrigins = (process.env.CORS_ORIGINS || '')
          .split(',')
          .map(s => s.trim())
          .filter(Boolean)
        const allowList = envOrigins.length ? envOrigins : defaults
        if (!origin || allowList.includes(origin)) {
          cb(null, true)
        } else {
          cb(new Error('Not allowed by CORS'), false)
        }
      },
      credentials: true
    })

    await fastify.register(multipart)

    await fastify.register(jwt, {
      secret: process.env.JWT_SECRET!
    })

    // Segurança básica
    await fastify.register(helmet)
    await fastify.register(rateLimit, {
      max: 300,
      timeWindow: '1 minute'
    })

    // Plugins utilitários
    await fastify.register(requestIdPlugin)
    await fastify.register(loggingPlugin)
    await fastify.register(responsePlugin)

    // Rota de health check
    fastify.get('/health', async (req, reply) => {
      return reply.success({ status: 'ok', timestamp: new Date().toISOString() })
    })

    // Metrics endpoint
    await fastify.register(metricsPlugin)
    await fastify.register(crmMetricsPlugin)

    // Error handler global
    await fastify.register(errorHandlerPlugin)

    // Definir middlewares globais de autenticação
    const { supabase } = require('../../../modules/auth/supabase')

    // Middleware de autenticação
    fastify.decorate('authenticate', async function (request: any, reply: any) {
      try {
        const token = request.headers.authorization?.replace('Bearer ', '')
        if (!token) {
          return reply.status(401).send({ error: 'Token não fornecido' })
        }

        const { data: { user }, error } = await supabase.auth.getUser(token)
        if (error || !user) {
          return reply.status(401).send({ error: 'Token inválido' })
        }

        // Buscar dados completos do usuário
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        request.user = { ...user, ...userData }
      } catch (error) {
        return reply.status(401).send({ error: 'Erro de autenticação' })
      }
    })

    // Middleware para verificar role
    fastify.decorate('requireRole', (roles: string[]) => {
      return async function (request: any, reply: any) {
        if (!request.user) {
          return reply.status(401).send({ error: 'Usuário não autenticado' })
        }

        if (!roles.includes(request.user.role)) {
          return reply.status(403).send({ error: 'Acesso negado' })
        }
      }
    })

    // Registrar rotas dos módulos (resolução em runtime para não acoplar build)
    // Nota: Em dev (tsx), paths relativos a partir de src funcionam. Em build, avaliar bundling/embedding de módulos.
    const authRoutes = (require('../../../modules/auth/routes') as any).default
    const crmRoutes = (require('../../../modules/crm/routes') as any).default
    const aiRoutes = (require('../../../modules/ai/routes') as any).default
    const whatsappRoutes = (require('../../../modules/whatsapp/routes') as any).default
    const botRoutes = (require('../../../modules/bots/routes') as any).default
    const settingsRoutes = (require('../../../modules/settings/routes') as any).default

    await fastify.register(authRoutes, { prefix: '/api/auth' })
    await fastify.register(crmRoutes, { prefix: '/api/crm' })
    await fastify.register(aiRoutes, { prefix: '/api/ai' })
    await fastify.register(whatsappRoutes, { prefix: '/api/whatsapp' })
    await fastify.register(botRoutes, { prefix: '/api/bots' })
    await fastify.register(settingsRoutes, { prefix: '/api/settings' })

    // Rotas específicas do MVP
    await fastify.register(import('./routes/mvp'), { prefix: '/api/mvp' })

    const port = parseInt(process.env.API_PORT || '3002')
    const host = process.env.API_HOST || 'localhost'

    await fastify.listen({ port, host })
    console.log(`🚀 Servidor rodando em http://${host}:${port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
