import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import ConfigLayout from '../components/ConfigLayout'

export default function Planos() {
  const [billingCycle, setBillingCycle] = useState('monthly')

  return (
    <ConfigLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-blue-600 mb-2">
                💰 Planos e Assinatura
              </h1>
              <p className="text-gray-600">
                Gerencie seu plano atual e explore opções de upgrade
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-green-100 text-green-800">
                Plano Essencial Ativo
              </Badge>
              <Button className="bg-blue-600 hover:bg-blue-700">
                🚀 Fazer Upgrade
              </Button>
            </div>
          </div>
        </div>

        {/* Current Plan Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Plano Atual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-green-600">Essencial</div>
              <p className="text-xs text-gray-500">R$ 29/mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Próxima Cobrança
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-blue-600">30/02/2025</div>
              <p className="text-xs text-gray-500">Em 28 dias</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Método de Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-purple-600">Cartão •••• 1234</div>
              <p className="text-xs text-gray-500">Visa</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-green-600">Em Dia</div>
              <p className="text-xs text-gray-500">Pagamento automático</p>
            </CardContent>
          </Card>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === 'yearly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Anual (2 meses grátis)
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              name: 'Essencial',
              price: billingCycle === 'monthly' ? 29 : 290,
              originalPrice: billingCycle === 'yearly' ? 348 : null,
              description: 'Ideal para corretor solo ou micro imobiliária',
              current: true,
              popular: false,
              features: [
                '1 canal WhatsApp',
                'IA básica de resposta',
                'Automações prontas',
                'Relatórios básicos',
                '500 leads/mês',
                '100 créditos de voz'
              ],
              limits: {
                leads: 500,
                voice_credits: 100,
                automations: 3,
                channels: 1
              }
            },
            {
              name: 'Personalizável',
              price: billingCycle === 'monthly' ? 149 : 1490,
              originalPrice: billingCycle === 'yearly' ? 1788 : null,
              description: 'Pequena imobiliária estruturada',
              current: false,
              popular: true,
              features: [
                '3 canais (WhatsApp, Instagram, Telegram)',
                'IA personalizável',
                'Painel de configuração',
                'Número próprio WhatsApp',
                '2.000 leads/mês',
                '500 créditos de voz',
                'Automações customizadas'
              ],
              limits: {
                leads: 2000,
                voice_credits: 500,
                automations: 10,
                channels: 3
              }
            },
            {
              name: 'Gestão',
              price: billingCycle === 'monthly' ? 600 : 6000,
              originalPrice: billingCycle === 'yearly' ? 7200 : null,
              description: 'Equipe consolidada com CRM completo',
              current: false,
              popular: false,
              features: [
                'CRM completo incluso',
                'Gestão de equipe',
                'Funil de vendas avançado',
                'Relatórios detalhados',
                'Integrações externas',
                '10.000 leads/mês',
                '2.000 créditos de voz',
                'Suporte prioritário'
              ],
              limits: {
                leads: 10000,
                voice_credits: 2000,
                automations: 50,
                team_members: 10
              }
            },
            {
              name: 'Rede',
              price: billingCycle === 'monthly' ? 1200 : 12000,
              originalPrice: billingCycle === 'yearly' ? 14400 : null,
              description: 'Redes, franquias ou grupos',
              current: false,
              popular: false,
              features: [
                'Múltiplas imobiliárias',
                'Painel centralizado',
                'API avançada',
                'Consultor dedicado',
                'Relatórios comparativos',
                '50.000 leads/mês',
                '10.000 créditos de voz',
                'Gestão de franquias',
                'White label disponível'
              ],
              limits: {
                leads: 50000,
                voice_credits: 10000,
                automations: 200,
                team_members: 100,
                units: 10
              }
            }
          ].map((plan, index) => (
            <Card 
              key={index} 
              className={`relative ${
                plan.current ? 'border-green-500 bg-green-50' : 
                plan.popular ? 'border-blue-500 bg-blue-50' : 
                'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white">Mais Popular</Badge>
                </div>
              )}
              
              {plan.current && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-green-600 text-white">Plano Atual</Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <div className="flex items-center justify-center">
                    <span className="text-3xl font-bold">R$ {plan.price}</span>
                    <span className="text-gray-500 ml-1">
                      /{billingCycle === 'monthly' ? 'mês' : 'ano'}
                    </span>
                  </div>
                  {plan.originalPrice && (
                    <div className="text-sm text-gray-500 line-through">
                      R$ {plan.originalPrice}/ano
                    </div>
                  )}
                </div>
                <CardDescription className="mt-2">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-sm">
                      <span className="text-green-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="space-y-3 mb-6">
                  <h4 className="font-medium text-sm text-gray-900">Limites:</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-600">Leads:</span>
                      <span className="font-medium ml-1">{plan.limits.leads.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Voz:</span>
                      <span className="font-medium ml-1">{plan.limits.voice_credits}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Automações:</span>
                      <span className="font-medium ml-1">{plan.limits.automations}</span>
                    </div>
                    {plan.limits.team_members && (
                      <div>
                        <span className="text-gray-600">Equipe:</span>
                        <span className="font-medium ml-1">{plan.limits.team_members}</span>
                      </div>
                    )}
                  </div>
                </div>

                <Button 
                  className={`w-full ${
                    plan.current 
                      ? 'bg-gray-100 text-gray-600 cursor-not-allowed' 
                      : plan.popular 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-900 hover:bg-gray-800 text-white'
                  }`}
                  disabled={plan.current}
                >
                  {plan.current ? 'Plano Atual' : 'Selecionar Plano'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Usage Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-blue-700">
                <span className="mr-2 text-2xl">📊</span>
                Uso Atual do Plano
              </CardTitle>
              <CardDescription>
                Acompanhe seu consumo mensal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: 'Leads processados', used: 127, limit: 500, unit: 'leads' },
                  { label: 'Créditos de voz', used: 45, limit: 100, unit: 'créditos' },
                  { label: 'Automações ativas', used: 3, limit: 3, unit: 'automações' },
                  { label: 'Canais conectados', used: 1, limit: 1, unit: 'canais' }
                ].map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{item.label}</span>
                      <span className="text-sm text-gray-600">
                        {item.used}/{item.limit} {item.unit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          (item.used / item.limit) > 0.8 ? 'bg-red-500' :
                          (item.used / item.limit) > 0.6 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min((item.used / item.limit) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {Math.round((item.used / item.limit) * 100)}% utilizado
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-green-700">
                <span className="mr-2 text-2xl">💳</span>
                Informações de Cobrança
              </CardTitle>
              <CardDescription>
                Gerencie seu método de pagamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">VISA</span>
                      </div>
                      <div>
                        <div className="font-medium">•••• •••• •••• 1234</div>
                        <div className="text-sm text-gray-500">Expira em 12/2027</div>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Principal</Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Próxima cobrança:</span>
                    <span className="font-medium">30/02/2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Valor:</span>
                    <span className="font-medium">R$ 29,00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className="font-medium text-green-600">Ativo</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button className="w-full" variant="outline">
                    💳 Alterar Cartão
                  </Button>
                  <Button className="w-full" variant="outline">
                    📄 Ver Faturas
                  </Button>
                  <Button className="w-full" variant="outline">
                    📧 Alterar Email de Cobrança
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upgrade Recommendations */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-700">
              <span className="mr-2 text-2xl">🚀</span>
              Recomendação de Upgrade
            </CardTitle>
            <CardDescription>
              Baseado no seu uso atual, recomendamos:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-blue-900">Plano Personalizável</h3>
                <p className="text-blue-700 mb-2">
                  Você está usando 25% dos seus leads. Com o upgrade você terá:
                </p>
                <ul className="text-sm text-blue-600 space-y-1">
                  <li>• 4x mais leads (2.000/mês)</li>
                  <li>• 5x mais créditos de voz (500)</li>
                  <li>• 3 canais de atendimento</li>
                  <li>• IA personalizável</li>
                </ul>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">R$ 149/mês</div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Fazer Upgrade Agora
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ConfigLayout>
  )
}
