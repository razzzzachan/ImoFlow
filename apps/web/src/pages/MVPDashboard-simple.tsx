import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'

export default function MVPDashboardSimple() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          🏠 ImmoFlow MVP
        </h1>
        <p className="text-xl text-gray-600">
          Sistema definitivo para imobiliárias com IA especializada
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total de Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">127</div>
            <p className="text-sm text-green-600">+12% desde ontem</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Mensagens WhatsApp
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">1,247</div>
            <p className="text-sm text-green-600">+5% desde ontem</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Automações Ativas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">8</div>
            <p className="text-sm text-gray-600">Funcionando perfeitamente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Taxa de Conversão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">23.5%</div>
            <p className="text-sm text-green-600">+2% desde a semana passada</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Leads Recentes */}
        <Card>
          <CardHeader>
            <CardTitle>🎯 Leads Recentes</CardTitle>
            <CardDescription>
              Leads capturados via WhatsApp e outras fontes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: 'João Silva',
                  phone: '(11) 99999-1111',
                  status: 'captado',
                  score: 85,
                  source: 'whatsapp'
                },
                {
                  name: 'Maria Santos',
                  phone: '(11) 99999-2222',
                  status: 'em_atendimento',
                  score: 92,
                  source: 'website'
                },
                {
                  name: 'Pedro Costa',
                  phone: '(11) 99999-3333',
                  status: 'visita_marcada',
                  score: 95,
                  source: 'portal'
                }
              ].map((lead, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                  <div>
                    <h3 className="font-medium">{lead.name}</h3>
                    <p className="text-sm text-gray-500">{lead.phone}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">
                      Score: {lead.score}
                    </Badge>
                    <Badge>
                      {lead.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Automações */}
        <Card>
          <CardHeader>
            <CardTitle>⚙️ Automações Ativas</CardTitle>
            <CardDescription>
              Automações configuradas para otimizar seu atendimento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: 'Resposta Automática WhatsApp',
                  executions: 47,
                  active: true
                },
                {
                  name: 'Follow-up 24h',
                  executions: 23,
                  active: true
                },
                {
                  name: 'Qualificação de Leads',
                  executions: 31,
                  active: true
                },
                {
                  name: 'Agendamento de Visitas',
                  executions: 8,
                  active: false
                }
              ].map((automation, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                  <div>
                    <h3 className="font-medium">{automation.name}</h3>
                    <p className="text-sm text-gray-500">{automation.executions} execuções</p>
                  </div>
                  <Badge variant={automation.active ? "default" : "secondary"}>
                    {automation.active ? "Ativa" : "Inativa"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Planos */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>💰 Planos Disponíveis</CardTitle>
            <CardDescription>
              Estratégia "Lock-in + Upsell" com 4 planos escalonados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                {
                  name: 'Essencial',
                  price: 'R$ 29',
                  description: 'Corretor solo',
                  features: ['1 canal WhatsApp', 'IA básica', 'Fluxos prontos']
                },
                {
                  name: 'Personalizável',
                  price: 'R$ 149',
                  description: 'Pequena imobiliária',
                  features: ['2 canais', 'IA personalizável', 'Número próprio']
                },
                {
                  name: 'Gestão',
                  price: 'R$ 600',
                  description: 'Equipe consolidada',
                  features: ['Multicanal', 'CRM incluso', 'Integrações']
                },
                {
                  name: 'Rede',
                  price: 'R$ 1.200',
                  description: 'Franquias/grupos',
                  features: ['Enterprise', 'Multi-unidade', 'API avançada']
                }
              ].map((plan, index) => (
                <div key={index} className="p-4 border rounded-lg bg-white">
                  <h3 className="font-bold text-lg">{plan.name}</h3>
                  <div className="text-2xl font-bold text-blue-600 my-2">{plan.price}</div>
                  <p className="text-sm text-gray-600 mb-3">{plan.description}</p>
                  <ul className="text-sm space-y-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-4" variant="outline">
                    Selecionar
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-gray-600">
          🚀 ImmoFlow MVP - Sistema definitivo para imobiliárias com IA especializada
        </p>
        <div className="mt-4 space-x-4">
          <Button>🤖 Conectar WhatsApp</Button>
          <Button variant="outline">⚡ Configurar Setup</Button>
          <Button variant="outline">📊 Ver Relatórios</Button>
        </div>
      </div>
    </div>
  )
}
