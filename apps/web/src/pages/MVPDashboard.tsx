import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  MessageSquare, 
  Users, 
  Zap, 
  BarChart3, 
  Phone,
  Mail,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface Lead {
  id: string
  name?: string
  phone: string
  email?: string
  status: string
  interest_type?: string
  property_type?: string
  location_preference?: string
  budget_range?: string
  lead_score: number
  source: string
  created_at: string
  last_interaction?: string
}

interface Automation {
  id: string
  name: string
  trigger_type: string
  active: boolean
  executions_count: number
}

export default function MVPDashboard() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [automations, setAutomations] = useState<Automation[]>([])
  const [stats, setStats] = useState({
    totalLeads: 0,
    whatsappMessages: 0,
    activeAutomations: 0,
    conversionRate: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Carregar leads
      const leadsResponse = await fetch('/api/mvp/leads')
      const leadsData = await leadsResponse.json()
      
      if (leadsData.success) {
        setLeads(leadsData.leads)
        setStats(prev => ({ ...prev, totalLeads: leadsData.leads.length }))
      }

      // Carregar automações
      const automationsResponse = await fetch('/api/mvp/automations')
      const automationsData = await automationsResponse.json()
      
      if (automationsData.success) {
        setAutomations(automationsData.automations)
        setStats(prev => ({ 
          ...prev, 
          activeAutomations: automationsData.automations.filter((a: Automation) => a.active).length 
        }))
      }

    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      'captado': 'bg-blue-100 text-blue-800',
      'em_atendimento': 'bg-yellow-100 text-yellow-800',
      'visita_marcada': 'bg-purple-100 text-purple-800',
      'proposta': 'bg-orange-100 text-orange-800',
      'negociacao': 'bg-indigo-100 text-indigo-800',
      'fechado': 'bg-green-100 text-green-800',
      'perdido': 'bg-red-100 text-red-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getLeadScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    if (score >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">ImmoFlow MVP</h1>
          <p className="text-gray-600">Sistema definitivo para imobiliárias com IA especializada</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <MessageSquare className="w-4 h-4 mr-2" />
          Conectar WhatsApp
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLeads}</div>
            <p className="text-xs text-muted-foreground">
              +12% desde ontem
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mensagens WhatsApp</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.whatsappMessages}</div>
            <p className="text-xs text-muted-foreground">
              +5% desde ontem
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Automações Ativas</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeAutomations}</div>
            <p className="text-xs text-muted-foreground">
              Funcionando perfeitamente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              +2% desde a semana passada
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="leads" className="space-y-4">
        <TabsList>
          <TabsTrigger value="leads">Mini-CRM</TabsTrigger>
          <TabsTrigger value="automations">Automações</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp Bot</TabsTrigger>
          <TabsTrigger value="integrations">Integrações</TabsTrigger>
        </TabsList>

        {/* Mini-CRM Tab */}
        <TabsContent value="leads" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Leads Recentes</CardTitle>
              <CardDescription>
                Leads capturados via WhatsApp e outras fontes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leads.slice(0, 10).map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium">{lead.name || 'Lead sem nome'}</h3>
                          <Badge className={getStatusColor(lead.status)}>
                            {lead.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          {lead.phone && (
                            <div className="flex items-center">
                              <Phone className="w-3 h-3 mr-1" />
                              {lead.phone}
                            </div>
                          )}
                          {lead.email && (
                            <div className="flex items-center">
                              <Mail className="w-3 h-3 mr-1" />
                              {lead.email}
                            </div>
                          )}
                          {lead.location_preference && (
                            <div className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {lead.location_preference}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className={`font-medium ${getLeadScoreColor(lead.lead_score)}`}>
                          Score: {lead.lead_score}
                        </div>
                        <div className="text-sm text-gray-500">
                          {lead.source}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Automações Tab */}
        <TabsContent value="automations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Automações Ativas</CardTitle>
              <CardDescription>
                Automações configuradas para otimizar seu atendimento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {automations.map((automation) => (
                  <div key={automation.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {automation.active ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{automation.name}</h3>
                        <p className="text-sm text-gray-500">
                          Trigger: {automation.trigger_type.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-medium">
                          {automation.executions_count} execuções
                        </div>
                        <Badge variant={automation.active ? "default" : "secondary"}>
                          {automation.active ? "Ativa" : "Inativa"}
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm">
                        Configurar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* WhatsApp Bot Tab */}
        <TabsContent value="whatsapp" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bot WhatsApp com IA Especializada</CardTitle>
              <CardDescription>
                Atendimento automatizado com inteligência imobiliária
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <MessageSquare className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Bot WhatsApp Configurado</h3>
                <p className="text-gray-600 mb-4">
                  Seu bot está pronto para atender clientes com IA especializada em imóveis
                </p>
                <Button className="bg-green-600 hover:bg-green-700">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Testar Bot
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrações Tab */}
        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Aberta para Integrações</CardTitle>
              <CardDescription>
                Conecte o ImmoFlow com seus sistemas existentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Webhook de Entrada</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Receba leads de sites e portais automaticamente
                  </p>
                  <code className="text-xs bg-gray-100 p-2 rounded block">
                    POST /api/mvp/integrations/webhook
                  </code>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">API de Leads</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Exporte seus leads para sistemas externos
                  </p>
                  <code className="text-xs bg-gray-100 p-2 rounded block">
                    GET /api/mvp/integrations/leads
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
