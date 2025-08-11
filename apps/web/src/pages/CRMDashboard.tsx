import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'

export default function CRMDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-green-600 mb-2">
              🏢 CRM Imobiliário
            </h1>
            <p className="text-xl text-gray-600">
              Gestão completa de leads, funil de vendas e equipe
            </p>
          </div>
          <Badge className="bg-green-100 text-green-800 px-4 py-2 text-sm">
            Produto 2 - CRM
          </Badge>
        </div>
      </div>

      {/* Stats Cards - Foco em Gestão */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total de Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">127</div>
            <p className="text-sm text-green-600">+12% desde ontem</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Taxa de Conversão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">23.5%</div>
            <p className="text-sm text-green-600">+2% desde a semana passada</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Visitas Agendadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">28</div>
            <p className="text-sm text-gray-600">Para esta semana</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Vendas Fechadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">7</div>
            <p className="text-sm text-green-600">+3 desde a semana passada</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Funil de Vendas */}
        <Card>
          <CardHeader>
            <CardTitle>📊 Funil de Vendas</CardTitle>
            <CardDescription>
              Acompanhe o progresso dos leads pelo funil
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  estagio: 'Captado',
                  quantidade: 45,
                  percentual: 35.4,
                  cor: 'bg-blue-500'
                },
                {
                  estagio: 'Em Atendimento',
                  quantidade: 32,
                  percentual: 25.2,
                  cor: 'bg-yellow-500'
                },
                {
                  estagio: 'Visita Marcada',
                  quantidade: 28,
                  percentual: 22.0,
                  cor: 'bg-purple-500'
                },
                {
                  estagio: 'Proposta Enviada',
                  quantidade: 15,
                  percentual: 11.8,
                  cor: 'bg-orange-500'
                },
                {
                  estagio: 'Fechado',
                  quantidade: 7,
                  percentual: 5.5,
                  cor: 'bg-green-500'
                }
              ].map((stage, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${stage.cor}`}></div>
                    <div>
                      <h3 className="font-medium">{stage.estagio}</h3>
                      <p className="text-sm text-gray-500">{stage.percentual}% do total</p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-700">
                    {stage.quantidade}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Leads Ativos */}
        <Card>
          <CardHeader>
            <CardTitle>🎯 Leads Ativos</CardTitle>
            <CardDescription>
              Leads em andamento com gestão ativa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: 'João Silva',
                  phone: '(11) 99999-1111',
                  status: 'visita_marcada',
                  score: 85,
                  corretor: 'Maria Silva',
                  data_visita: 'Sáb 14h'
                },
                {
                  name: 'Maria Santos',
                  phone: '(11) 99999-2222',
                  status: 'proposta',
                  score: 92,
                  corretor: 'João Costa',
                  valor_proposta: 'R$ 850k'
                },
                {
                  name: 'Pedro Costa',
                  phone: '(11) 99999-3333',
                  status: 'em_atendimento',
                  score: 95,
                  corretor: 'Ana Souza',
                  ultimo_contato: 'Ontem'
                }
              ].map((lead, index) => (
                <div key={index} className="p-4 border rounded-lg bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{lead.name}</h3>
                    <Badge variant="outline">Score: {lead.score}</Badge>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{lead.phone}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-gray-600">Corretor: </span>
                      <span className="font-medium">{lead.corretor}</span>
                    </div>
                    <Badge>
                      {lead.status === 'visita_marcada' ? 'Visita Marcada' :
                       lead.status === 'proposta' ? 'Proposta' : 'Em Atendimento'}
                    </Badge>
                  </div>
                  {lead.data_visita && (
                    <p className="text-sm text-blue-600 mt-1">📅 {lead.data_visita}</p>
                  )}
                  {lead.valor_proposta && (
                    <p className="text-sm text-green-600 mt-1">💰 {lead.valor_proposta}</p>
                  )}
                  {lead.ultimo_contato && (
                    <p className="text-sm text-gray-500 mt-1">📞 {lead.ultimo_contato}</p>
                  )}
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" variant="outline">
              + Adicionar Lead Manual
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Performance da Equipe */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>👥 Performance da Equipe</CardTitle>
            <CardDescription>
              Acompanhe o desempenho dos corretores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  nome: 'Maria Silva',
                  leads_ativos: 15,
                  conversao: 28.5,
                  vendas_mes: 3
                },
                {
                  nome: 'João Costa',
                  leads_ativos: 12,
                  conversao: 22.1,
                  vendas_mes: 2
                },
                {
                  nome: 'Ana Souza',
                  leads_ativos: 18,
                  conversao: 31.2,
                  vendas_mes: 4
                }
              ].map((corretor, index) => (
                <div key={index} className="p-4 border rounded-lg bg-white">
                  <h3 className="font-medium mb-2">{corretor.nome}</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Leads Ativos:</span>
                      <span className="font-medium">{corretor.leads_ativos}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Conversão:</span>
                      <span className="font-medium text-green-600">{corretor.conversao}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vendas/Mês:</span>
                      <span className="font-medium text-blue-600">{corretor.vendas_mes}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Planos do Produto 2 - CRM */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>💰 Planos - CRM Imobiliário</CardTitle>
            <CardDescription>
              Escolha o plano ideal para sua gestão de leads
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  name: 'Gestão',
                  price: 'R$ 600',
                  description: 'Equipe conectada com CRM completo',
                  features: [
                    'CRM completo incluso',
                    'Gestão de equipe',
                    'Funil de vendas',
                    'Relatórios avançados',
                    'Integrações externas'
                  ],
                  current: true
                },
                {
                  name: 'Rede',
                  price: 'R$ 1.200',
                  description: 'Multi-imobiliárias com painel centralizado',
                  features: [
                    'Múltiplas imobiliárias',
                    'Painel centralizado',
                    'API avançada',
                    'Consultor dedicado',
                    'Relatórios comparativos',
                    'Gestão de franquias'
                  ],
                  current: false
                }
              ].map((plan, index) => (
                <div key={index} className={`p-6 border rounded-lg ${plan.current ? 'border-green-500 bg-green-50' : 'bg-white'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg">{plan.name}</h3>
                    {plan.current && (
                      <Badge className="bg-green-600 text-white">Atual</Badge>
                    )}
                  </div>
                  <div className="text-3xl font-bold text-green-600 mb-2">{plan.price}</div>
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
            
            {/* CTA para Rede */}
            {!false && ( // Mostrar se não está no plano Rede
              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-900 mb-2">
                  🏢 Gerencie várias imobiliárias em um só lugar!
                </h4>
                <p className="text-sm text-green-700 mb-3">
                  Com o plano Rede você pode conectar múltiplas imobiliárias e ter visão centralizada de tudo.
                </p>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  🚀 Upgrade para Rede
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Footer com Ações */}
      <div className="mt-8 text-center">
        <div className="space-x-4">
          <Button className="bg-green-600 hover:bg-green-700">
            🏢 Gerenciar Leads
          </Button>
          <Button variant="outline">
            📊 Relatórios de Vendas
          </Button>
          <Button variant="outline">
            👥 Configurar Equipe
          </Button>
        </div>
      </div>
    </div>
  )
}
