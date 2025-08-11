import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import ConfigLayout from '../components/ConfigLayout'

export default function ConfigDashboard() {
  const navigate = useNavigate()

  return (
    <ConfigLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Painel de Configuração
              </h1>
              <p className="text-gray-600">
                Configure seu ImmoFlow para máxima eficiência
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-green-100 text-green-800">
                Sistema Ativo
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
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <span className="mr-2">💬</span>
                WhatsApp
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold text-green-600">Conectado</div>
                  <p className="text-xs text-gray-500">+55 11 99999-1111</p>
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <span className="mr-2">🤖</span>
                IA Assistente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold text-blue-600">Ativo</div>
                  <p className="text-xs text-gray-500">Modelo GPT-4</p>
                </div>
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <span className="mr-2">⚙️</span>
                Automações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold text-purple-600">8 Ativas</div>
                  <p className="text-xs text-gray-500">247 execuções hoje</p>
                </div>
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <span className="mr-2">🏢</span>
                CRM
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold text-orange-600">127 Leads</div>
                  <p className="text-xs text-gray-500">23.5% conversão</p>
                </div>
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Configuration Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          
          {/* WhatsApp Configuration */}
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center text-green-700">
                <span className="mr-2 text-2xl">💬</span>
                Configuração WhatsApp
              </CardTitle>
              <CardDescription>
                Gerencie sua conexão e configurações do WhatsApp
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <div className="font-medium text-green-900">Status da Conexão</div>
                    <div className="text-sm text-green-700">Conectado e funcionando</div>
                  </div>
                  <Badge className="bg-green-600 text-white">Ativo</Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Número:</span>
                    <span className="font-medium">+55 11 99999-1111</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Mensagens hoje:</span>
                    <span className="font-medium">247</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Última atividade:</span>
                    <span className="font-medium">2 min atrás</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button className="w-full" variant="outline">
                    🔧 Configurar Mensagens
                  </Button>
                  <Button className="w-full" variant="outline">
                    📱 Gerenciar QR Code
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* IA Configuration */}
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-700">
                <span className="mr-2 text-2xl">🤖</span>
                IA Personalizada
              </CardTitle>
              <CardDescription>
                Configure o comportamento da sua IA especializada
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <div className="font-medium text-blue-900">Assistente Ativo</div>
                    <div className="text-sm text-blue-700">Especializado em imóveis</div>
                  </div>
                  <Badge className="bg-blue-600 text-white">GPT-4</Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Personalidade:</span>
                    <span className="font-medium">Profissional</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Idioma:</span>
                    <span className="font-medium">Português BR</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Conhecimento:</span>
                    <span className="font-medium">Imobiliário</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button className="w-full" variant="outline">
                    ✏️ Editar Personalidade
                  </Button>
                  <Button className="w-full" variant="outline">
                    📚 Treinar Conhecimento
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Automations */}
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center text-purple-700">
                <span className="mr-2 text-2xl">⚙️</span>
                Automações
              </CardTitle>
              <CardDescription>
                Gerencie fluxos automáticos de atendimento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  {[
                    { name: 'Resposta Automática', status: 'ativa', executions: 89 },
                    { name: 'Follow-up 24h', status: 'ativa', executions: 45 },
                    { name: 'Qualificação Lead', status: 'ativa', executions: 67 },
                    { name: 'Agendamento', status: 'inativa', executions: 12 }
                  ].map((automation, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <div className="text-sm font-medium">{automation.name}</div>
                        <div className="text-xs text-gray-500">{automation.executions} execuções</div>
                      </div>
                      <Badge variant={automation.status === 'ativa' ? 'default' : 'secondary'}>
                        {automation.status}
                      </Badge>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Button className="w-full" variant="outline">
                    ➕ Nova Automação
                  </Button>
                  <Button className="w-full" variant="outline">
                    📊 Ver Relatórios
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CRM Configuration */}
          <Card className="border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center text-orange-700">
                <span className="mr-2 text-2xl">🏢</span>
                CRM Imobiliário
              </CardTitle>
              <CardDescription>
                Configure gestão de leads e funil de vendas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div>
                    <div className="font-medium text-orange-900">CRM Ativo</div>
                    <div className="text-sm text-orange-700">127 leads em gestão</div>
                  </div>
                  <Badge className="bg-orange-600 text-white">Gestão</Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Leads ativos:</span>
                    <span className="font-medium">127</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Taxa conversão:</span>
                    <span className="font-medium">23.5%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Equipe:</span>
                    <span className="font-medium">3 corretores</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button className="w-full" variant="outline">
                    👥 Gerenciar Equipe
                  </Button>
                  <Button className="w-full" variant="outline">
                    📊 Configurar Funil
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Integrations */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-700">
                <span className="mr-2 text-2xl">🔌</span>
                Integrações
              </CardTitle>
              <CardDescription>
                Conecte com sistemas externos e APIs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  {[
                    { name: 'Zapier', status: 'conectado', icon: '⚡' },
                    { name: 'Google Sheets', status: 'conectado', icon: '📊' },
                    { name: 'Mailchimp', status: 'disponível', icon: '📧' },
                    { name: 'Pipedrive', status: 'disponível', icon: '🔄' }
                  ].map((integration, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center space-x-2">
                        <span>{integration.icon}</span>
                        <div className="text-sm font-medium">{integration.name}</div>
                      </div>
                      <Badge variant={integration.status === 'conectado' ? 'default' : 'outline'}>
                        {integration.status}
                      </Badge>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Button className="w-full" variant="outline">
                    🔗 Nova Integração
                  </Button>
                  <Button className="w-full" variant="outline">
                    🔧 Configurar APIs
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Plan & Billing */}
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center text-green-700">
                <span className="mr-2 text-2xl">💰</span>
                Plano & Cobrança
              </CardTitle>
              <CardDescription>
                Gerencie sua assinatura e faturamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <div className="font-medium text-green-900">Plano Essencial</div>
                    <div className="text-sm text-green-700">R$ 29/mês</div>
                  </div>
                  <Badge className="bg-green-600 text-white">Ativo</Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Próxima cobrança:</span>
                    <span className="font-medium">30/02/2025</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Método:</span>
                    <span className="font-medium">Cartão •••• 1234</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium text-green-600">Em dia</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    🚀 Fazer Upgrade
                  </Button>
                  <Button className="w-full" variant="outline">
                    💳 Alterar Pagamento
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
              <CardTitle>🚀 Ações Rápidas</CardTitle>
              <CardDescription>
                Acesse rapidamente as funcionalidades mais usadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  variant="outline"
                  onClick={() => navigate('/dashboard/ia-personalizada/canais/whatsapp')}
                >
                  <span className="text-2xl">📱</span>
                  <span className="text-sm">Conectar WhatsApp</span>
                </Button>
                <Button
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  variant="outline"
                  onClick={() => navigate('/dashboard/ia-personalizada/treinamento')}
                >
                  <span className="text-2xl">🤖</span>
                  <span className="text-sm">Treinar IA</span>
                </Button>
                <Button
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  variant="outline"
                  onClick={() => navigate('/dashboard/relatorios')}
                >
                  <span className="text-2xl">📊</span>
                  <span className="text-sm">Ver Relatórios</span>
                </Button>
                <Button
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  variant="outline"
                  onClick={() => navigate('/dashboard/gestao-leads')}
                >
                  <span className="text-2xl">👥</span>
                  <span className="text-sm">Gerenciar Equipe</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ConfigLayout>
  )
}
