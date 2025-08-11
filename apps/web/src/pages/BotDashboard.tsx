import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'

export default function BotDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-blue-600 mb-2">
              🤖 Atendimento com IA
            </h1>
            <p className="text-xl text-gray-600">
              Automação inteligente de atendimento por voz e texto
            </p>
          </div>
          <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-sm">
            Produto 1 - Bot
          </Badge>
        </div>
      </div>

      {/* Stats Cards - Foco em Atendimento */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Mensagens Enviadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">1,247</div>
            <p className="text-sm text-green-600">+15% desde ontem</p>
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
              Canais Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">3</div>
            <p className="text-sm text-gray-600">WhatsApp, Voz, Telegram</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Taxa de Resposta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">94.2%</div>
            <p className="text-sm text-green-600">+3% desde a semana passada</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Automações do Bot */}
        <Card>
          <CardHeader>
            <CardTitle>⚙️ Automações de Atendimento</CardTitle>
            <CardDescription>
              Automações configuradas para resposta e follow-up
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: 'Resposta Automática WhatsApp',
                  executions: 247,
                  active: true,
                  type: 'resposta'
                },
                {
                  name: 'Follow-up 24h',
                  executions: 89,
                  active: true,
                  type: 'follow_up'
                },
                {
                  name: 'Agendamento Automático',
                  executions: 45,
                  active: true,
                  type: 'agendamento'
                },
                {
                  name: 'Resposta Fora do Horário',
                  executions: 156,
                  active: false,
                  type: 'horario'
                }
              ].map((automation, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                  <div>
                    <h3 className="font-medium">{automation.name}</h3>
                    <p className="text-sm text-gray-500">{automation.executions} execuções hoje</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={automation.active ? "default" : "secondary"}>
                      {automation.active ? "Ativa" : "Inativa"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" variant="outline">
              + Criar Nova Automação
            </Button>
          </CardContent>
        </Card>

        {/* Leads Capturados (Entrada) */}
        <Card>
          <CardHeader>
            <CardTitle>📥 Leads Capturados (Entrada)</CardTitle>
            <CardDescription>
              Contatos capturados pelo bot - sem gestão ativa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: 'João Silva',
                  phone: '(11) 99999-1111',
                  canal: 'WhatsApp',
                  hora: '14:30'
                },
                {
                  name: 'Maria Santos',
                  phone: '(11) 99999-2222',
                  canal: 'Voz',
                  hora: '13:45'
                },
                {
                  name: 'Pedro Costa',
                  phone: '(11) 99999-3333',
                  canal: 'WhatsApp',
                  hora: '12:20'
                }
              ].map((lead, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                  <div>
                    <h3 className="font-medium">{lead.name}</h3>
                    <p className="text-sm text-gray-500">{lead.phone} • {lead.hora}</p>
                  </div>
                  <Badge variant="outline">
                    {lead.canal}
                  </Badge>
                </div>
              ))}
            </div>
            
            {/* CTA para CRM */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">
                💡 Quer gerenciar esses leads profissionalmente?
              </h4>
              <p className="text-sm text-blue-700 mb-3">
                Com nosso CRM você pode acompanhar o funil, agendar visitas e aumentar suas vendas!
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                🚀 Conhecer CRM Imobiliário
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Planos do Produto 1 - Bot */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>💰 Planos - Atendimento com IA</CardTitle>
            <CardDescription>
              Escolha o plano ideal para seu atendimento automatizado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  name: 'Essencial',
                  price: 'R$ 29',
                  description: 'Atendimento simples por canal único',
                  features: [
                    '1 canal WhatsApp',
                    'IA básica de resposta',
                    'Automações prontas',
                    'Relatórios básicos'
                  ],
                  current: true
                },
                {
                  name: 'Personalizável',
                  price: 'R$ 149',
                  description: 'Controle total de canais e personalização',
                  features: [
                    '3 canais (WhatsApp, Voz, Telegram)',
                    'IA personalizável',
                    'Painel de configuração',
                    'Agendamento automático',
                    'Horários customizados'
                  ],
                  current: false
                }
              ].map((plan, index) => (
                <div key={index} className={`p-6 border rounded-lg ${plan.current ? 'border-blue-500 bg-blue-50' : 'bg-white'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg">{plan.name}</h3>
                    {plan.current && (
                      <Badge className="bg-blue-600 text-white">Atual</Badge>
                    )}
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">{plan.price}</div>
                  <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                  <ul className="text-sm space-y-2 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    variant={plan.current ? "outline" : "default"}
                  >
                    {plan.current ? 'Plano Atual' : 'Fazer Upgrade'}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer com Ações */}
      <div className="mt-8 text-center">
        <div className="space-x-4">
          <Button className="bg-blue-600 hover:bg-blue-700">
            🤖 Configurar Bot
          </Button>
          <Button variant="outline">
            ⚙️ Gerenciar Automações
          </Button>
          <Button variant="outline">
            📊 Relatórios de Atendimento
          </Button>
        </div>
      </div>
    </div>
  )
}
