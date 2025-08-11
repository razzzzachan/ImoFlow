import Fastify from 'fastify'
import cors from '@fastify/cors'

// Servidor simplificado para demonstração
const fastify = Fastify({
  logger: {
    level: 'info'
  }
})

// Registrar CORS
fastify.register(cors, {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
})

// Rota de health check
fastify.get('/health', async (request, reply) => {
  return { 
    status: 'ok', 
    message: 'ImmoFlow API está funcionando!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  }
})

// Rotas do MVP (simuladas)
fastify.get('/api/mvp/status', async (request, reply) => {
  return {
    success: true,
    message: 'ImmoFlow MVP - Sistema Definitivo para Imobiliárias',
    features: {
      whatsapp_bot: 'Configurado',
      ai_specialized: 'Ativo',
      mini_crm: 'Funcionando',
      automations: 'Ativas',
      api_integrations: 'Disponível'
    },
    plans: [
      { name: 'Essencial', price: 29, status: 'available' },
      { name: 'Personalizável', price: 149, status: 'available' },
      { name: 'Gestão', price: 600, status: 'available' },
      { name: 'Rede', price: 1200, status: 'available' }
    ]
  }
})

// Rota para simular leads
fastify.get('/api/mvp/leads', async (request, reply) => {
  return {
    success: true,
    leads: [
      {
        id: '1',
        name: 'João Silva',
        phone: '(11) 99999-1111',
        email: 'joao@email.com',
        status: 'captado',
        interest_type: 'compra',
        property_type: 'apartamento',
        location_preference: 'Vila Madalena',
        budget_range: 'R$ 500k - R$ 800k',
        lead_score: 85,
        source: 'whatsapp',
        created_at: '2025-01-30T10:00:00Z'
      },
      {
        id: '2',
        name: 'Maria Santos',
        phone: '(11) 99999-2222',
        email: 'maria@email.com',
        status: 'em_atendimento',
        interest_type: 'venda',
        property_type: 'casa',
        location_preference: 'Pinheiros',
        budget_range: 'R$ 1M - R$ 1.5M',
        lead_score: 92,
        source: 'website',
        created_at: '2025-01-30T09:30:00Z'
      },
      {
        id: '3',
        name: 'Pedro Costa',
        phone: '(11) 99999-3333',
        status: 'visita_marcada',
        interest_type: 'compra',
        property_type: 'comercial',
        location_preference: 'Faria Lima',
        budget_range: 'R$ 2M+',
        lead_score: 95,
        source: 'portal',
        created_at: '2025-01-30T08:15:00Z'
      }
    ],
    total: 3,
    stats: {
      total_leads: 3,
      whatsapp_messages: 47,
      active_automations: 5,
      conversion_rate: 23.5
    }
  }
})

// Rota para simular automações
fastify.get('/api/mvp/automations', async (request, reply) => {
  return {
    success: true,
    automations: [
      {
        id: '1',
        name: 'Resposta Automática WhatsApp',
        trigger_type: 'new_lead',
        active: true,
        executions_count: 47
      },
      {
        id: '2',
        name: 'Follow-up 24h',
        trigger_type: 'time_based',
        active: true,
        executions_count: 23
      },
      {
        id: '3',
        name: 'Qualificação de Leads',
        trigger_type: 'new_lead',
        active: true,
        executions_count: 31
      },
      {
        id: '4',
        name: 'Agendamento de Visitas',
        trigger_type: 'status_change',
        active: false,
        executions_count: 8
      },
      {
        id: '5',
        name: 'Notificação Corretor',
        trigger_type: 'score_threshold',
        active: true,
        executions_count: 15
      }
    ]
  }
})

// Rota para simular webhook WhatsApp
fastify.post('/api/mvp/whatsapp/message', async (request, reply) => {
  const { from, message, type } = request.body as any
  
  return {
    success: true,
    response: `Olá! Recebemos sua mensagem: "${message}". Nossa IA especializada em imóveis está analisando e em breve um corretor entrará em contato!`,
    leadId: 'lead_' + Date.now(),
    actions: ['qualify_lead', 'notify_agent'],
    ai_analysis: {
      interest_type: 'compra',
      property_type: 'apartamento',
      urgency: 'media',
      confidence: 0.85
    }
  }
})

// Rota para planos
fastify.get('/api/mvp/plans', async (request, reply) => {
  return {
    success: true,
    plans: [
      {
        id: 'essencial',
        name: 'Plano Essencial',
        price: 29,
        description: 'Ideal para corretor solo ou micro imobiliária',
        features: ['1 canal WhatsApp', 'IA básica', 'Fluxos prontos', 'Relatórios básicos'],
        limits: { leads_per_month: 500, voice_credits: 100, automations: 3 }
      },
      {
        id: 'personalizavel',
        name: 'Plano Personalizável',
        price: 149,
        description: 'Pequena imobiliária estruturada',
        features: ['2 canais', 'IA personalizável', 'Número próprio', 'Personalização'],
        limits: { leads_per_month: 2000, voice_credits: 500, automations: 10 }
      },
      {
        id: 'gestao',
        name: 'Plano Gestão',
        price: 600,
        description: 'Imobiliária com equipe consolidada',
        features: ['Multicanal', 'CRM incluso', 'Integrações', 'Relatórios avançados'],
        limits: { leads_per_month: 10000, voice_credits: 2000, automations: 50 }
      },
      {
        id: 'rede',
        name: 'Plano Rede',
        price: 1200,
        description: 'Redes, franquias ou grupos',
        features: ['Enterprise', 'Multi-unidade', 'API avançada', 'Consultor dedicado'],
        limits: { leads_per_month: 50000, voice_credits: 10000, automations: 200 }
      }
    ]
  }
})

// Iniciar servidor
const start = async () => {
  try {
    const port = process.env.API_PORT || 3001
    const host = process.env.API_HOST || 'localhost'
    
    await fastify.listen({ port: Number(port), host })
    
    console.log(`
🚀 ImmoFlow API Demo rodando!
📍 URL: http://${host}:${port}
🏥 Health: http://${host}:${port}/health
📊 Status MVP: http://${host}:${port}/api/mvp/status
👥 Leads: http://${host}:${port}/api/mvp/leads
⚙️ Automações: http://${host}:${port}/api/mvp/automations
💰 Planos: http://${host}:${port}/api/mvp/plans

🎉 Sistema definitivo para imobiliárias com IA especializada!
    `)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
