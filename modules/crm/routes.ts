import { FastifyInstance } from 'fastify'
import { supabase } from '../auth/supabase'
import { CRMService } from './service'

const crmService = new CRMService()

export default async function crmRoutes(fastify: FastifyInstance) {
  // Listar leads
  fastify.get('/leads', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const filters = request.query as any
      const result = await crmService.getLeads(filters)
      return result
    } catch (error: any) {
      return reply.status(500).send({ error: error.message })
    }
  })

  // Criar lead
  fastify.post('/leads', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const leadData = request.body as any
      const userId = (request as any).user.id

      const lead = await crmService.createLead(leadData, userId)
      return { lead }
    } catch (error: any) {
      return reply.status(400).send({ error: error.message })
    }
  })

  // Atualizar lead
  fastify.put('/leads/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const updateData = request.body as any
      const userId = (request as any).user.id

      const lead = await crmService.updateLead(id, updateData, userId)
      return { lead }
    } catch (error: any) {
      return reply.status(400).send({ error: error.message })
    }
  })

  // Obter lead específico
  fastify.get('/leads/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const lead = await crmService.getLeadById(id)
      return { lead }
    } catch (error: any) {
      return reply.status(404).send({ error: error.message })
    }
  })

  // Listar interações de um lead
  fastify.get('/leads/:id/interactions', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string }

    const { data, error } = await supabase
      .from('interactions')
      .select(`
        *,
        user:users(name, avatar_url)
      `)
      .eq('lead_id', id)
      .order('created_at', { ascending: true })

    if (error) {
      return reply.status(400).send({ error: error.message })
    }

    return { interactions: data }
  })

  // Criar interação
  fastify.post('/leads/:id/interactions', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const interactionData = {
      ...request.body as any,
      lead_id: id,
      user_id: (request as any).user.id
    }

    const { data, error } = await supabase
      .from('interactions')
      .insert([interactionData])
      .select()
      .single()

    if (error) {
      return reply.status(400).send({ error: error.message })
    }

    return { interaction: data }
  })

  // Listar tarefas
  fastify.get('/tasks', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const { assigned_to, completed, lead_id } = request.query as any

    let query = supabase
      .from('tasks')
      .select(`
        *,
        lead:leads(name, phone),
        assigned_user:users!assigned_to(name, email)
      `)
      .order('due_date', { ascending: true })

    if (assigned_to) {
      query = query.eq('assigned_to', assigned_to)
    }

    if (completed !== undefined) {
      query = query.eq('completed', completed === 'true')
    }

    if (lead_id) {
      query = query.eq('lead_id', lead_id)
    }

    const { data, error } = await query

    if (error) {
      return reply.status(400).send({ error: error.message })
    }

    return { tasks: data }
  })

  // Criar tarefa
  fastify.post('/tasks', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const taskData = request.body as any

    const { data, error } = await supabase
      .from('tasks')
      .insert([taskData])
      .select()
      .single()

    if (error) {
      return reply.status(400).send({ error: error.message })
    }

    return { task: data }
  })

  // Atualizar tarefa
  fastify.put('/tasks/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const updateData = request.body as any

    const { data, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return reply.status(400).send({ error: error.message })
    }

    return { task: data }
  })

  // Estatísticas do dashboard
  fastify.get('/stats', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const stats = await crmService.getStats()
      return stats
    } catch (error: any) {
      return reply.status(500).send({ error: error.message })
    }
  })

  // Obter dados do funil
  fastify.get('/funnel', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const funnelData = await crmService.getFunnelData()
      return { funnel: funnelData }
    } catch (error: any) {
      return reply.status(500).send({ error: error.message })
    }
  })

  // Atribuir lead
  fastify.patch('/leads/:id/assign', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const { assigned_to } = request.body as { assigned_to: string }
      const userId = (request as any).user.id

      const lead = await crmService.assignLead(id, assigned_to, userId)
      return { lead }
    } catch (error: any) {
      return reply.status(400).send({ error: error.message })
    }
  })

  // Atualização em lote de status
  fastify.patch('/leads/bulk-status', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { lead_ids, status, reason } = request.body as {
        lead_ids: string[]
        status: string
        reason?: string
      }
      const userId = (request as any).user.id

      const results = await crmService.bulkUpdateStatus(lead_ids, status, userId, reason)
      return { results }
    } catch (error: any) {
      return reply.status(400).send({ error: error.message })
    }
  })
}
