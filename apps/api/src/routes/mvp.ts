import { FastifyPluginAsync } from 'fastify'
import { createClient } from '@supabase/supabase-js'

const mvpRoutes: FastifyPluginAsync = async (fastify) => {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // ============================================================================
  // MVP - BOT WHATSAPP COM IA ESPECIALIZADA
  // ============================================================================

  // Receber mensagem do WhatsApp
  fastify.post('/whatsapp/message', async (request, reply) => {
    try {
      const { from, message, type } = request.body as {
        from: string
        message: string
        type: 'text' | 'audio' | 'image'
      }

      // 1. Processar com IA especializada em imóveis
      const aiResponse = await processRealEstateMessage(message, type)

      // 2. Criar/atualizar lead no mini-CRM
      const lead = await createOrUpdateLead(from, message, aiResponse)

      // 3. Disparar automações se necessário
      await triggerAutomations(lead, aiResponse)

      // 4. Retornar resposta para WhatsApp
      return {
        success: true,
        response: aiResponse.message,
        leadId: lead.id,
        actions: aiResponse.actions
      }
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Erro ao processar mensagem' })
    }
  })

  // ============================================================================
  // MVP - MINI-CRM COM HISTÓRICO E ETIQUETAS
  // ============================================================================

  // Listar leads do mini-CRM
  fastify.get('/leads', async (request, reply) => {
    try {
      const { data: leads, error } = await supabase
        .from('leads')
        .select(`
          *,
          interactions:lead_interactions(*)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      return { success: true, leads }
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Erro ao buscar leads' })
    }
  })

  // Criar lead manualmente
  fastify.post('/leads', async (request, reply) => {
    try {
      const leadData = request.body as {
        name: string
        phone: string
        email?: string
        interest_type: string
        budget_range?: string
        location_preference?: string
        tags?: string[]
      }

      const { data: lead, error } = await supabase
        .from('leads')
        .insert([{
          ...leadData,
          status: 'captado',
          source: 'manual',
          lead_score: calculateLeadScore(leadData)
        }])
        .select()
        .single()

      if (error) throw error

      return { success: true, lead }
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Erro ao criar lead' })
    }
  })

  // Atualizar status do lead
  fastify.patch('/leads/:id/status', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const { status, notes } = request.body as { status: string, notes?: string }

      const { data: lead, error } = await supabase
        .from('leads')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      // Registrar mudança no histórico
      if (notes) {
        await supabase
          .from('lead_interactions')
          .insert([{
            lead_id: id,
            type: 'status_change',
            content: `Status alterado para: ${status}. ${notes}`,
            created_at: new Date().toISOString()
          }])
      }

      return { success: true, lead }
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Erro ao atualizar lead' })
    }
  })

  // ============================================================================
  // MVP - AUTOMAÇÕES BÁSICAS
  // ============================================================================

  // Listar automações ativas
  fastify.get('/automations', async (request, reply) => {
    try {
      const { data: automations, error } = await supabase
        .from('automations')
        .select('*')
        .eq('active', true)

      if (error) throw error

      return { success: true, automations }
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Erro ao buscar automações' })
    }
  })

  // Criar automação
  fastify.post('/automations', async (request, reply) => {
    try {
      const automationData = request.body as {
        name: string
        trigger_type: 'new_lead' | 'status_change' | 'time_based'
        trigger_conditions: any
        actions: any[]
        active: boolean
      }

      const { data: automation, error } = await supabase
        .from('automations')
        .insert([automationData])
        .select()
        .single()

      if (error) throw error

      return { success: true, automation }
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Erro ao criar automação' })
    }
  })

  // ============================================================================
  // MVP - API ABERTA PARA INTEGRAÇÕES
  // ============================================================================

  // Webhook para receber dados externos
  fastify.post('/integrations/webhook', async (request, reply) => {
    try {
      const { source, data, event_type } = request.body as {
        source: string
        data: any
        event_type: string
      }

      // Processar dados baseado na fonte
      let processedData
      switch (source) {
        case 'website':
          processedData = await processWebsiteLead(data)
          break
        case 'portal':
          processedData = await processPortalLead(data)
          break
        default:
          processedData = data
      }

      // Criar lead a partir dos dados externos
      const lead = await createLeadFromIntegration(processedData, source)

      return { success: true, leadId: lead.id }
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Erro ao processar webhook' })
    }
  })

  // Endpoint para integrações buscarem dados
  fastify.get('/integrations/leads', async (request, reply) => {
    try {
      const { api_key } = request.query as { api_key: string }

      // Validar API key
      const { data: integration, error } = await supabase
        .from('api_integrations')
        .select('*')
        .eq('api_key', api_key)
        .eq('active', true)
        .single()

      if (error || !integration) {
        return reply.status(401).send({ error: 'API key inválida' })
      }

      // Buscar leads baseado nas permissões da integração
      const { data: leads, error: leadsError } = await supabase
        .from('leads')
        .select('id, name, phone, email, status, created_at')
        .gte('created_at', integration.created_at)

      if (leadsError) throw leadsError

      return { success: true, leads }
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Erro ao buscar leads' })
    }
  })

  // ============================================================================
  // FUNÇÕES AUXILIARES
  // ============================================================================

  async function processRealEstateMessage(message: string, type: string) {
    // IA especializada em contexto imobiliário
    const prompt = `
    Você é um assistente especializado em imóveis. Analise esta mensagem de um potencial cliente:
    
    Mensagem: "${message}"
    Tipo: ${type}
    
    Identifique:
    1. Tipo de interesse (compra, venda, aluguel)
    2. Tipo de imóvel (casa, apartamento, comercial)
    3. Localização mencionada
    4. Faixa de preço mencionada
    5. Urgência (baixa, média, alta)
    6. Próxima ação recomendada
    
    Responda de forma natural e profissional, fazendo perguntas qualificadoras se necessário.
    `

    // Aqui integraria com OpenAI
    // Por ora, retorno mock
    return {
      message: "Olá! Vi que você tem interesse em imóveis. Pode me contar mais sobre o que está procurando?",
      analysis: {
        interest_type: "compra",
        property_type: "apartamento",
        location: null,
        budget_range: null,
        urgency: "media"
      },
      actions: ["qualify_lead", "schedule_visit"]
    }
  }

  async function createOrUpdateLead(phone: string, message: string, aiResponse: any) {
    // Verificar se lead já existe
    const { data: existingLead } = await supabase
      .from('leads')
      .select('*')
      .eq('phone', phone)
      .single()

    if (existingLead) {
      // Atualizar lead existente
      const { data: lead, error } = await supabase
        .from('leads')
        .update({
          last_interaction: new Date().toISOString(),
          lead_score: existingLead.lead_score + 5 // Incrementar score
        })
        .eq('id', existingLead.id)
        .select()
        .single()

      // Adicionar interação
      await supabase
        .from('lead_interactions')
        .insert([{
          lead_id: existingLead.id,
          type: 'whatsapp_message',
          content: message,
          ai_analysis: aiResponse.analysis
        }])

      return lead
    } else {
      // Criar novo lead
      const { data: lead, error } = await supabase
        .from('leads')
        .insert([{
          phone,
          status: 'captado',
          source: 'whatsapp',
          lead_score: 10,
          interest_type: aiResponse.analysis.interest_type,
          property_type: aiResponse.analysis.property_type,
          location_preference: aiResponse.analysis.location,
          budget_range: aiResponse.analysis.budget_range
        }])
        .select()
        .single()

      // Adicionar primeira interação
      await supabase
        .from('lead_interactions')
        .insert([{
          lead_id: lead.id,
          type: 'whatsapp_message',
          content: message,
          ai_analysis: aiResponse.analysis
        }])

      return lead
    }
  }

  async function triggerAutomations(lead: any, aiResponse: any) {
    // Buscar automações que devem ser disparadas
    const { data: automations } = await supabase
      .from('automations')
      .select('*')
      .eq('active', true)
      .eq('trigger_type', 'new_lead')

    for (const automation of automations || []) {
      // Executar ações da automação
      for (const action of automation.actions) {
        switch (action.type) {
          case 'send_message':
            // Enviar mensagem automática
            break
          case 'assign_to_agent':
            // Atribuir a um corretor
            break
          case 'schedule_followup':
            // Agendar follow-up
            break
        }
      }
    }
  }

  function calculateLeadScore(leadData: any): number {
    let score = 0
    
    if (leadData.email) score += 10
    if (leadData.budget_range) score += 15
    if (leadData.location_preference) score += 10
    if (leadData.interest_type === 'compra') score += 20
    
    return Math.min(score, 100)
  }

  async function processWebsiteLead(data: any) {
    return {
      name: data.name,
      phone: data.phone,
      email: data.email,
      interest_type: data.interest || 'compra',
      source: 'website'
    }
  }

  async function processPortalLead(data: any) {
    return {
      name: data.cliente_nome,
      phone: data.cliente_telefone,
      email: data.cliente_email,
      interest_type: 'compra',
      property_type: data.tipo_imovel,
      source: 'portal'
    }
  }

  async function createLeadFromIntegration(data: any, source: string) {
    const { data: lead, error } = await supabase
      .from('leads')
      .insert([{
        ...data,
        status: 'captado',
        source,
        lead_score: calculateLeadScore(data)
      }])
      .select()
      .single()

    if (error) throw error
    return lead
  }
}

export default mvpRoutes
