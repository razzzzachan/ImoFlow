import { FastifyInstance } from 'fastify'
import { supabase } from '../auth/supabase'
import { CRMService } from './service'
import { CreateLeadUseCase } from './application/use-cases/CreateLead'
import { CRMRepository } from './infra/repositories/CRMRepository'

const crmService = new CRMService()
const crmRepo = new CRMRepository()
const createLeadUC = new CreateLeadUseCase(crmRepo)

export default async function crmRoutes(fastify: FastifyInstance) {
  // Listar leads
  fastify.get('/leads', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { getLeadsQuerySchema } = require('./validation/leadSchemas')
      const filters = getLeadsQuerySchema.parse(request.query)
      const result = await new (require('./application/use-cases/GetLeads').GetLeadsUseCase)(crmRepo).execute(filters)
      return reply.success(result)
    } catch (error: any) {
      return reply.fail({ message: error.message, details: error?.issues }, 400)
    }
  })

  // Criar lead
  fastify.post('/leads', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { createLeadSchema } = require('./validation/leadSchemas')
      const leadPayload = createLeadSchema.parse(request.body)
      const userId = (request as any).user.id

      const lead = await createLeadUC.execute({ ...leadPayload, createdBy: userId })
      return reply.success({ lead })
    } catch (error: any) {
      return reply.fail({ message: error.message, details: error?.issues }, 400)
    }
  })

  // Atualizar lead
  fastify.put('/leads/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { updateLeadSchema } = require('./validation/leadSchemas')
      const { id } = request.params as { id: string }
      const updatePayload = updateLeadSchema.parse(request.body)
      const userId = (request as any).user.id

      const { UpdateLeadUseCase } = require('./application/use-cases/UpdateLead')
      const lead = await new UpdateLeadUseCase(crmRepo).execute(id, updatePayload, userId)
      return reply.success({ lead })
    } catch (error: any) {
      return reply.fail({ message: error.message, details: error?.issues }, 400)
    }
  })

  // Obter lead específico
  fastify.get('/leads/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const { GetLeadByIdUseCase } = require('./application/use-cases/GetLeadById')
      const lead = await new GetLeadByIdUseCase(crmRepo).execute(id)
      return reply.success({ lead })
    } catch (error: any) {
      return reply.fail({ message: error.message }, 404)
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
      return reply.fail({ message: error.message }, 400)
    }

    return reply.success({ interactions: data })
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
      return reply.fail({ message: error.message }, 400)
    }

    return reply.success({ interaction: data })
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
      return reply.fail({ message: error.message }, 400)
    }

    return reply.success({ tasks: data })
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
      return reply.fail({ message: error.message }, 400)
    }

    return reply.success({ task: data })
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
      return reply.fail({ message: error.message }, 400)
    }

    return reply.success({ task: data })
  })

  // Estatísticas do dashboard
  fastify.get('/stats', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const stats = await crmService.getStats()
      return reply.success(stats)
    } catch (error: any) {
      return reply.fail({ message: error.message }, 500)
    }
  })

  // Obter dados do funil
  fastify.get('/funnel', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const funnelData = await crmService.getFunnelData()
      return reply.success({ funnel: funnelData })
    } catch (error: any) {
      return reply.fail({ message: error.message }, 500)
    }
  })

  // Atribuir lead
  fastify.patch('/leads/:id/assign', { preHandler: [fastify.authenticate, fastify.requireRole(['admin', 'gestor'])] }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const body = (request.body || {}) as any
      if (!body.assigned_to) throw new Error('assigned_to é obrigatório')
      const userId = (request as any).user.id

      const { AssignLeadUseCase } = require('./application/use-cases/AssignLead')
      const lead = await new AssignLeadUseCase(crmRepo).execute(id, body.assigned_to, userId)
      return reply.success({ lead })
    } catch (error: any) {
      return reply.fail({ message: error.message }, 400)
    }
  })

  // Atualização em lote de status
  fastify.patch('/leads/bulk-status', { preHandler: [fastify.authenticate, fastify.requireRole(['admin', 'gestor'])] }, async (request, reply) => {
    try {
      const { bulkUpdateStatusSchema } = require('./validation/leadSchemas')
      const { lead_ids, status, reason } = bulkUpdateStatusSchema.parse(request.body)
      const userId = (request as any).user.id

      const { BulkUpdateStatusUseCase } = require('./application/use-cases/BulkUpdateStatus')
      const results = await new BulkUpdateStatusUseCase(crmRepo).execute(lead_ids, status, userId, reason)
      return reply.success({ results })
    } catch (error: any) {
      return reply.fail({ message: error.message, details: error?.issues }, 400)
    }
  })
}
