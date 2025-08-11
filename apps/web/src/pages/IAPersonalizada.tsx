import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import ConfigLayout from '../components/ConfigLayout'

export default function IAPersonalizada() {
  const navigate = useNavigate()

  return (
    <ConfigLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-blue-600 mb-2">
                🤖 IA Personalizada
              </h1>
              <p className="text-gray-600">
                Configure seu assistente virtual especializado em imóveis
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-blue-100 text-blue-800">
                GPT-4 Ativo
              </Badge>
              <Button className="bg-blue-600 hover:bg-blue-700">
                💾 Salvar Configurações
              </Button>
            </div>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Status da IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold text-green-600">Ativo</div>
                  <p className="text-xs text-gray-500">GPT-4 Turbo</p>
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Canais Conectados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-blue-600">3</div>
              <p className="text-xs text-gray-500">WhatsApp, Instagram, Telegram</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Automações Ativas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-purple-600">12</div>
              <p className="text-xs text-gray-500">Fluxos configurados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Treinamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-orange-600">85%</div>
              <p className="text-xs text-gray-500">Conhecimento imobiliário</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Canais */}
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-700">
                <span className="mr-2 text-2xl">📱</span>
                Canais de Atendimento
              </CardTitle>
              <CardDescription>
                Gerencie os canais onde sua IA atende clientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: 'WhatsApp',
                    icon: '💬',
                    status: 'Conectado',
                    color: 'green',
                    number: '+55 11 99999-1111',
                    messages: '247 hoje'
                  },
                  {
                    name: 'Instagram',
                    icon: '📸',
                    status: 'Conectado',
                    color: 'purple',
                    number: '@imobiliaria_exemplo',
                    messages: '89 hoje'
                  },
                  {
                    name: 'Telegram',
                    icon: '📱',
                    status: 'Desativado',
                    color: 'gray',
                    number: 'Não configurado',
                    messages: '0 hoje'
                  }
                ].map((canal, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{canal.icon}</span>
                        <div>
                          <h3 className="font-medium">{canal.name}</h3>
                          <p className="text-sm text-gray-500">{canal.number}</p>
                        </div>
                      </div>
                      <Badge className={`${
                        canal.color === 'green' ? 'bg-green-100 text-green-800' :
                        canal.color === 'purple' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {canal.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{canal.messages}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (canal.name === 'WhatsApp') {
                            navigate('/dashboard/ia-personalizada/canais/whatsapp')
                          } else if (canal.name === 'Instagram') {
                            navigate('/dashboard/ia-personalizada/canais/instagram')
                          } else if (canal.name === 'Telegram') {
                            navigate('/dashboard/ia-personalizada/canais/telegram')
                          }
                        }}
                      >
                        ⚙️ Configurar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4" variant="outline">
                📱 Gerenciar Todos os Canais
              </Button>
            </CardContent>
          </Card>

          {/* Automação */}
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center text-purple-700">
                <span className="mr-2 text-2xl">⚙️</span>
                Automação Inteligente
              </CardTitle>
              <CardDescription>
                Configure fluxos automáticos de atendimento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: 'Resposta Inicial',
                    description: 'Primeira mensagem automática',
                    executions: 247,
                    active: true
                  },
                  {
                    name: 'Qualificação de Lead',
                    description: 'Coleta dados do interessado',
                    executions: 189,
                    active: true
                  },
                  {
                    name: 'Agendamento de Visita',
                    description: 'Agenda visitas automaticamente',
                    executions: 67,
                    active: true
                  },
                  {
                    name: 'Follow-up 24h',
                    description: 'Retoma contato após 24h',
                    executions: 45,
                    active: false
                  }
                ].map((automation, index) => (
                  <div key={index} className="p-3 border rounded-lg bg-white">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm">{automation.name}</h4>
                      <Badge variant={automation.active ? "default" : "secondary"}>
                        {automation.active ? "Ativa" : "Inativa"}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{automation.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">{automation.executions} execuções</span>
                      <Button size="sm" variant="outline">
                        ✏️ Editar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4" variant="outline">
                ➕ Criar Nova Automação
              </Button>
            </CardContent>
          </Card>

          {/* Atendimento por Voz */}
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center text-green-700">
                <span className="mr-2 text-2xl">🎤</span>
                Atendimento por Voz
              </CardTitle>
              <CardDescription>
                Configure o assistente de voz inteligente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-green-900">Voz Ativa</h4>
                      <p className="text-sm text-green-700">Português brasileiro, tom profissional</p>
                    </div>
                    <Badge className="bg-green-600 text-white">Ativo</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Chamadas hoje:</span>
                      <span className="font-medium ml-2">23</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Duração média:</span>
                      <span className="font-medium ml-2">3m 45s</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Taxa de sucesso:</span>
                      <span className="font-medium ml-2 text-green-600">87%</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Satisfação:</span>
                      <span className="font-medium ml-2 text-green-600">4.2/5</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button className="w-full" variant="outline">
                    🎵 Configurar Tom de Voz
                  </Button>
                  <Button className="w-full" variant="outline">
                    📞 Testar Chamada
                  </Button>
                  <Button className="w-full" variant="outline">
                    📊 Ver Relatórios de Voz
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Treinamento */}
          <Card className="border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center text-orange-700">
                <span className="mr-2 text-2xl">📚</span>
                Treinamento da IA
              </CardTitle>
              <CardDescription>
                Ensine sua IA sobre seu negócio e mercado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-orange-900">Conhecimento Atual</h4>
                      <p className="text-sm text-orange-700">85% de conhecimento imobiliário</p>
                    </div>
                    <div className="text-2xl font-bold text-orange-600">85%</div>
                  </div>
                  
                  <div className="w-full bg-orange-200 rounded-full h-2 mb-3">
                    <div className="bg-orange-600 h-2 rounded-full" style={{width: '85%'}}></div>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { area: 'Tipos de Imóveis', progress: 95, color: 'green' },
                    { area: 'Documentação', progress: 80, color: 'blue' },
                    { area: 'Financiamento', progress: 75, color: 'yellow' },
                    { area: 'Legislação', progress: 60, color: 'red' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.area}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              item.color === 'green' ? 'bg-green-500' :
                              item.color === 'blue' ? 'bg-blue-500' :
                              item.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{width: `${item.progress}%`}}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{item.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Button className="w-full" variant="outline">
                    📖 Adicionar Conhecimento
                  </Button>
                  <Button className="w-full" variant="outline">
                    🧪 Testar Conhecimento
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>🚀 Ações Rápidas - IA</CardTitle>
              <CardDescription>
                Acesse rapidamente as configurações mais importantes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  variant="outline"
                  onClick={() => navigate('/dashboard/ia-personalizada/canais/whatsapp')}
                >
                  <span className="text-2xl">💬</span>
                  <span className="text-sm">Config WhatsApp</span>
                </Button>
                <Button
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  variant="outline"
                  onClick={() => navigate('/dashboard/ia-personalizada/automacao')}
                >
                  <span className="text-2xl">⚙️</span>
                  <span className="text-sm">Nova Automação</span>
                </Button>
                <Button
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  variant="outline"
                  onClick={() => navigate('/dashboard/ia-personalizada/atendimento-voz')}
                >
                  <span className="text-2xl">🎤</span>
                  <span className="text-sm">Testar Voz</span>
                </Button>
                <Button
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  variant="outline"
                  onClick={() => navigate('/dashboard/ia-personalizada/treinamento')}
                >
                  <span className="text-2xl">📚</span>
                  <span className="text-sm">Treinar IA</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ConfigLayout>
  )
}
