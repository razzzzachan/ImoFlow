import { FastifyInstance } from 'fastify'
import { WhatsAppService } from './service'
import { supabase } from '../auth/supabase'

const whatsappService = new WhatsAppService()

export default async function whatsappRoutes(fastify: FastifyInstance) {
  // Inicializar WhatsApp
  fastify.post('/initialize', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const userId = (request as any).user.id
      
      const qrCode = await whatsappService.initialize(userId)
      
      return { qrCode, message: 'WhatsApp inicializado. Escaneie o QR Code.' }
    } catch (error) {
      console.error('Erro ao inicializar WhatsApp:', error)
      return reply.status(500).send({ error: 'Erro ao inicializar WhatsApp' })
    }
  })

  // Obter status da conexão
  fastify.get('/status', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const userId = (request as any).user.id
      const status = await whatsappService.getConnectionStatus(userId)
      
      return { status }
    } catch (error) {
      console.error('Erro ao obter status:', error)
      return reply.status(500).send({ error: 'Erro ao obter status' })
    }
  })

  // Desconectar WhatsApp
  fastify.post('/disconnect', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const userId = (request as any).user.id
      await whatsappService.disconnect(userId)
      
      return { message: 'WhatsApp desconectado com sucesso' }
    } catch (error) {
      console.error('Erro ao desconectar:', error)
      return reply.status(500).send({ error: 'Erro ao desconectar WhatsApp' })
    }
  })

  // Enviar mensagem
  fastify.post('/send-message', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { phone, message, leadId } = request.body as {
        phone: string
        message: string
        leadId?: string
      }
      
      const userId = (request as any).user.id
      
      const success = await whatsappService.sendMessage(phone, message)
      
      if (success && leadId) {
        // Registrar interação no banco
        await supabase
          .from('interactions')
          .insert([{
            lead_id: leadId,
            user_id: userId,
            type: 'text',
            content: message,
            metadata: {
              direction: 'outbound',
              phone: phone
            }
          }])
      }
      
      return { success, message: success ? 'Mensagem enviada' : 'Falha ao enviar mensagem' }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      return reply.status(500).send({ error: 'Erro ao enviar mensagem' })
    }
  })

  // Listar conversas recentes
  fastify.get('/conversations', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const conversations = await whatsappService.getRecentConversations()
      
      return { conversations }
    } catch (error) {
      console.error('Erro ao listar conversas:', error)
      return reply.status(500).send({ error: 'Erro ao listar conversas' })
    }
  })

  // Webhook para receber mensagens (se usando API oficial do WhatsApp)
  fastify.post('/webhook', async (request, reply) => {
    try {
      const { body } = request
      
      // Processar webhook do WhatsApp Business API
      if (body && body.entry) {
        for (const entry of body.entry) {
          if (entry.changes) {
            for (const change of entry.changes) {
              if (change.value && change.value.messages) {
                for (const message of change.value.messages) {
                  await whatsappService.processIncomingMessage(message)
                }
              }
            }
          }
        }
      }
      
      return { status: 'ok' }
    } catch (error) {
      console.error('Erro no webhook:', error)
      return reply.status(500).send({ error: 'Erro no webhook' })
    }
  })

  // Verificação do webhook (WhatsApp Business API)
  fastify.get('/webhook', async (request, reply) => {
    const { query } = request
    const mode = (query as any)['hub.mode']
    const token = (query as any)['hub.verify_token']
    const challenge = (query as any)['hub.challenge']
    
    // Verificar token (configurar no .env)
    if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
      return challenge
    }
    
    return reply.status(403).send('Forbidden')
  })

  // Configurar resposta automática
  fastify.post('/auto-response', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { enabled, message, keywords } = request.body as {
        enabled: boolean
        message: string
        keywords?: string[]
      }
      
      const userId = (request as any).user.id
      
      await whatsappService.setAutoResponse(userId, {
        enabled,
        message,
        keywords: keywords || []
      })
      
      return { message: 'Resposta automática configurada' }
    } catch (error) {
      console.error('Erro ao configurar resposta automática:', error)
      return reply.status(500).send({ error: 'Erro ao configurar resposta automática' })
    }
  })

  // Obter métricas do WhatsApp
  fastify.get('/metrics', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { data: interactions } = await supabase
        .from('interactions')
        .select('*')
        .eq('type', 'text')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Últimos 7 dias

      const inbound = interactions?.filter(i => i.metadata?.direction === 'inbound').length || 0
      const outbound = interactions?.filter(i => i.metadata?.direction === 'outbound').length || 0
      
      const { data: leads } = await supabase
        .from('leads')
        .select('*')
        .eq('source', 'whatsapp')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

      return {
        messages: {
          inbound,
          outbound,
          total: inbound + outbound
        },
        leads: {
          total: leads?.length || 0,
          thisWeek: leads?.length || 0
        }
      }
    } catch (error) {
      console.error('Erro ao obter métricas:', error)
      return reply.status(500).send({ error: 'Erro ao obter métricas' })
    }
  })
}
