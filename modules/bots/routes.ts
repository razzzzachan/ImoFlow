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
      const { name, description, mode } = request.body as {
        name: string
        description?: string
        mode?: string
      }

      const bot = await botService.createBot(userId, name, description, mode)
      return { bot }
    } catch (error: any) {
      return reply.status(400).send({ error: error.message })
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
      const { channel_user_id, message, channel } = request.body as {
        channel_user_id: string
        message: string
        channel?: string
      }

      const response = await botService.processMessage(id, channel_user_id, message, channel)
      return response
    } catch (error: any) {
      return reply.status(500).send({ error: error.message })
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
      const { name, description } = request.body as {
        name: string
        description?: string
      }

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
        return reply.status(400).send({ error: error.message })
      }

      return { flow }
    } catch (error: any) {
      return reply.status(500).send({ error: error.message })
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
        return reply.status(404).send({ error: 'Bot não encontrado' })
      }

      // Buscar estatísticas
      const { data: totalSessions } = await supabase
        .from('bot_sessions')
        .select('id', { count: 'exact' })
        .eq('bot_id', id)

      const { data: activeSessions } = await supabase
        .from('bot_sessions')
        .select('id', { count: 'exact' })
        .eq('bot_id', id)
        .eq('is_active', true)

      const { data: leadsCreated } = await supabase
        .from('bot_sessions')
        .select('lead_id', { count: 'exact' })
        .eq('bot_id', id)
        .not('lead_id', 'is', null)

      const { data: messagesCount } = await supabase
        .from('bot_messages')
        .select('id', { count: 'exact' })
        .in('session_id', 
          await supabase
            .from('bot_sessions')
            .select('id')
            .eq('bot_id', id)
            .then(res => res.data?.map(s => s.id) || [])
        )

      return {
        stats: {
          total_sessions: totalSessions?.length || 0,
          active_sessions: activeSessions?.length || 0,
          leads_created: leadsCreated?.length || 0,
          total_messages: messagesCount?.length || 0
        }
      }
    } catch (error: any) {
      return reply.status(500).send({ error: error.message })
    }
  })
}
