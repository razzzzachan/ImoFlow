import { FastifyPluginAsync } from 'fastify'
import client from 'prom-client'

const crmMetricsPlugin: FastifyPluginAsync = async (fastify) => {
  const register = (fastify as any).crmRegister as client.Registry | undefined
  const useOwn = !register
  const reg = useOwn ? new client.Registry() : register

  const leadsCreated = new client.Counter({
    name: 'crm_leads_created_total',
    help: 'Total de leads criados'
  })

  const statusChanges = new client.Counter({
    name: 'crm_status_changes_total',
    help: 'Total de mudanças de status em leads'
  })

  reg.registerMetric(leadsCreated)
  reg.registerMetric(statusChanges)

  fastify.decorate('crmMetrics', {
    leadsCreated,
    statusChanges
  })

  fastify.addHook('onRoute', (routeOptions) => {
    // opcional: tags por rota se necessário
  })

  if (useOwn) {
    client.collectDefaultMetrics({ register: reg })
    fastify.get('/metrics-crm', async (_req, reply) => {
      reply.header('Content-Type', reg.contentType)
      return reg.metrics()
    })
  }
}

export default crmMetricsPlugin

