import { FastifyInstance } from 'fastify'
import { BotService } from './service'
import { supabase } from '../auth/supabase'

const botService = new BotService()

export default async function botRoutes(fastify: FastifyInstance) {
  // Listar bots do usuário
  fastify.get('/bots', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const userId = (request as any).user.id

      const { data: bots, error } = await supabase
        .from('bots')
        .select(`
          *,
          bot_flows(count)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        return reply.status(400).send({ error: error.message })
      }

      return { bots }
    } catch (error: any) {
      return reply.status(500).send({ error: error.message })
    }
  })

  // Criar novo bot
  fastify.post('/bots', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const userId = (request as any).user.id
      const { createBotSchema } = require('./validation/schemas')
      const { name, description, mode } = createBotSchema.parse(request.body)

      const bot = await botService.createBot(userId, name, description, mode)
      return reply.success({ bot })
    } catch (error: any) {
      return reply.fail({ message: error.message, details: error?.issues }, 400)
    }
  })

  // Obter bot específico
  fastify.get('/bots/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const userId = (request as any).user.id

      const { data: bot, error } = await supabase
        .from('bots')
        .select(`
          *,
          bot_flows(
            *,
            bot_blocks(
              *,
              from_connections:bot_connections!from_block_id(*),
              to_connections:bot_connections!to_block_id(*)
            )
          )
        `)
        .eq('id', id)
        .eq('user_id', userId)
        .single()

      if (error) {
        return reply.status(404).send({ error: 'Bot não encontrado' })
      }

      return { bot }
    } catch (error: any) {
      return reply.status(500).send({ error: error.message })
    }
  })

  // Atualizar bot
  fastify.put('/bots/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const userId = (request as any).user.id
      const updateData = request.body as any

      const { data: bot, error } = await supabase
        .from('bots')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) {
        return reply.status(400).send({ error: error.message })
      }

      return { bot }
    } catch (error: any) {
      return reply.status(500).send({ error: error.message })
    }
  })

  // Ativar/Desativar bot
  fastify.patch('/bots/:id/toggle', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const userId = (request as any).user.id

      // Buscar bot atual
      const { data: currentBot } = await supabase
        .from('bots')
        .select('is_active')
        .eq('id', id)
        .eq('user_id', userId)
        .single()

      if (!currentBot) {
        return reply.status(404).send({ error: 'Bot não encontrado' })
      }

      const { data: bot, error } = await supabase
        .from('bots')
        .update({ is_active: !currentBot.is_active })
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) {
        return reply.status(400).send({ error: error.message })
      }

      return { bot }
    } catch (error: any) {
      return reply.status(500).send({ error: error.message })
    }
  })

  // Processar mensagem do bot (webhook)
  fastify.post('/bots/:id/message', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const { messageSchema } = require('./validation/schemas')
      const { channel_user_id, message, channel } = messageSchema.parse(request.body)

      const response = await botService.processMessage(id, channel_user_id, message, channel)
      return reply.success(response)
    } catch (error: any) {
      return reply.fail({ message: error.message, details: error?.issues }, 500)
    }
  })

  // Listar fluxos de um bot
  fastify.get('/bots/:id/flows', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const userId = (request as any).user.id

      // Verificar se o bot pertence ao usuário
      const { data: bot } = await supabase
        .from('bots')
        .select('id')
        .eq('id', id)
        .eq('user_id', userId)
        .single()

      if (!bot) {
        return reply.status(404).send({ error: 'Bot não encontrado' })
      }

      const { data: flows, error } = await supabase
        .from('bot_flows')
        .select(`
          *,
          bot_blocks(count)
        `)
        .eq('bot_id', id)
        .order('created_at', { ascending: false })

      if (error) {
        return reply.status(400).send({ error: error.message })
      }

      return { flows }
    } catch (error: any) {
      return reply.status(500).send({ error: error.message })
    }
  })

  // Criar novo fluxo
  fastify.post('/bots/:id/flows', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const userId = (request as any).user.id
      const { createFlowSchema } = require('./validation/schemas')
      const { name, description } = createFlowSchema.parse(request.body)

      // Verificar se o bot pertence ao usuário
      const { data: bot } = await supabase
        .from('bots')
        .select('id')
        .eq('id', id)
        .eq('user_id', userId)
        .single()

      if (!bot) {
        return reply.fail({ message: 'Bot não encontrado' }, 404)
      }

      const { data: flow, error } = await supabase
        .from('bot_flows')
        .insert([{
          bot_id: id,
          name,
          flow_data: { description }
        }])
        .select()
        .single()

      if (error) {
        return reply.fail({ message: error.message }, 400)
      }

      return reply.success({ flow })
    } catch (error: any) {
      return reply.fail({ message: error.message, details: error?.issues }, 500)
    }
  })

  // Obter sessões ativas do bot
  fastify.get('/bots/:id/sessions', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const userId = (request as any).user.id

      // Verificar se o bot pertence ao usuário
      const { data: bot } = await supabase
        .from('bots')
        .select('id')
        .eq('id', id)
        .eq('user_id', userId)
        .single()

      if (!bot) {
        return reply.status(404).send({ error: 'Bot não encontrado' })
      }

      const { data: sessions, error } = await supabase
        .from('bot_sessions')
        .select(`
          *,
          lead:leads(name, phone),
          current_block:bot_blocks(name, block_type)
        `)
        .eq('bot_id', id)
        .eq('is_active', true)
        .order('updated_at', { ascending: false })

      if (error) {
        return reply.status(400).send({ error: error.message })
      }

      return { sessions }
    } catch (error: any) {
      return reply.status(500).send({ error: error.message })
    }
  })

  // Obter histórico de mensagens de uma sessão
  fastify.get('/sessions/:sessionId/messages', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { sessionId } = request.params as { sessionId: string }

      const { data: messages, error } = await supabase
        .from('bot_messages')
        .select(`
          *,
          block:bot_blocks(name, block_type)
        `)
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true })

      if (error) {
        return reply.status(400).send({ error: error.message })
      }

      return { messages }
    } catch (error: any) {
      return reply.status(500).send({ error: error.message })
    }
  })

  // Estatísticas do bot
  fastify.get('/bots/:id/stats', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const userId = (request as any).user.id

      // Verificar se o bot pertence ao usuário
      const { data: bot } = await supabase
        .from('bots')
        .select('id')
        .eq('id', id)
        .eq('user_id', userId)
        .single()

      if (!bot) {
        return reply.fail({ message: 'Bot não encontrado' }, 404)
      }

      // Buscar estatísticas (usando count via headers)
      const totalSessionsRes = await supabase
        .from('bot_sessions')
        .select('id', { count: 'exact', head: true })
        .eq('bot_id', id)

      const activeSessionsRes = await supabase
        .from('bot_sessions')
        .select('id', { count: 'exact', head: true })
        .eq('bot_id', id)
        .eq('is_active', true)

      const leadsCreatedRes = await supabase
        .from('bot_sessions')
        .select('lead_id', { count: 'exact', head: true })
        .eq('bot_id', id)
        .not('lead_id', 'is', null)

      const sessionIds = await supabase
        .from('bot_sessions')
        .select('id')
        .eq('bot_id', id)

      const messagesRes = await supabase
        .from('bot_messages')
        .select('id', { count: 'exact', head: true })
        .in('session_id', (sessionIds.data || []).map(s => s.id))

      return reply.success({
        stats: {
          total_sessions: totalSessionsRes.count || 0,
          active_sessions: activeSessionsRes.count || 0,
          leads_created: leadsCreatedRes.count || 0,
          total_messages: messagesRes.count || 0
        }
      })
    } catch (error: any) {
      return reply.status(500).send({ error: error.message })
    }
  })
}
