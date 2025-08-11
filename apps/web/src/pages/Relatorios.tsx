import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import ConfigLayout from '../components/ConfigLayout'

export default function Relatorios() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d')

  return (
    <ConfigLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-purple-600 mb-2">
                📈 Relatórios e Analytics
              </h1>
              <p className="text-gray-600">
                Acompanhe métricas detalhadas do seu negócio
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border rounded-lg bg-white"
              >
                <option value="7d">Últimos 7 dias</option>
                <option value="30d">Últimos 30 dias</option>
                <option value="90d">Últimos 90 dias</option>
                <option value="1y">Último ano</option>
              </select>
              <Button className="bg-purple-600 hover:bg-purple-700">
                📤 Exportar Relatório
              </Button>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total de Leads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">1,247</div>
              <p className="text-xs text-green-600">+15.3% vs período anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Taxa de Conversão
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">23.5%</div>
              <p className="text-xs text-green-600">+2.1% vs período anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Vendas Fechadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">47</div>
              <p className="text-xs text-green-600">+8.7% vs período anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Receita Gerada
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">R$ 2.8M</div>
              <p className="text-xs text-green-600">+12.4% vs período anterior</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Leads por Fonte */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-blue-700">
                <span className="mr-2 text-2xl">📊</span>
                Leads por Fonte
              </CardTitle>
              <CardDescription>
                Origem dos leads nos últimos {selectedPeriod === '7d' ? '7 dias' : selectedPeriod === '30d' ? '30 dias' : selectedPeriod === '90d' ? '90 dias' : 'ano'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { source: 'WhatsApp', count: 567, percentage: 45.5, color: 'bg-green-500' },
                  { source: 'Website', count: 312, percentage: 25.0, color: 'bg-blue-500' },
                  { source: 'Instagram', count: 189, percentage: 15.2, color: 'bg-purple-500' },
                  { source: 'Portais', count: 134, percentage: 10.7, color: 'bg-orange-500' },
                  { source: 'Indicação', count: 45, percentage: 3.6, color: 'bg-gray-500' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                      <span className="font-medium">{item.source}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${item.color}`}
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-12 text-right">{item.count}</span>
                      <span className="text-sm text-gray-500 w-12 text-right">{item.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance por Corretor */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-green-700">
                <span className="mr-2 text-2xl">👥</span>
                Performance por Corretor
              </CardTitle>
              <CardDescription>
                Ranking de vendas da equipe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Ana Souza', sales: 12, conversion: 31.2, revenue: 'R$ 890k', rank: 1 },
                  { name: 'Maria Silva', sales: 10, conversion: 28.5, revenue: 'R$ 720k', rank: 2 },
                  { name: 'João Costa', sales: 8, conversion: 22.1, revenue: 'R$ 580k', rank: 3 },
                  { name: 'Carlos Lima', sales: 6, conversion: 18.7, revenue: 'R$ 420k', rank: 4 }
                ].map((agent, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                        agent.rank === 1 ? 'bg-yellow-500' :
                        agent.rank === 2 ? 'bg-gray-400' :
                        agent.rank === 3 ? 'bg-orange-600' : 'bg-gray-600'
                      }`}>
                        {agent.rank}
                      </div>
                      <div>
                        <div className="font-medium">{agent.name}</div>
                        <div className="text-sm text-gray-500">{agent.sales} vendas</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-green-600">{agent.revenue}</div>
                      <div className="text-sm text-gray-500">{agent.conversion}% conversão</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Funil de Conversão */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-purple-700">
                <span className="mr-2 text-2xl">🔄</span>
                Funil de Conversão
              </CardTitle>
              <CardDescription>
                Taxa de conversão por etapa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { stage: 'Lead Captado', count: 1247, rate: 100, color: 'bg-blue-500' },
                  { stage: 'Qualificado', count: 892, rate: 71.5, color: 'bg-indigo-500' },
                  { stage: 'Atendimento', count: 634, rate: 50.8, color: 'bg-yellow-500' },
                  { stage: 'Visita Marcada', count: 312, rate: 25.0, color: 'bg-purple-500' },
                  { stage: 'Proposta', count: 156, rate: 12.5, color: 'bg-orange-500' },
                  { stage: 'Fechado', count: 47, rate: 3.8, color: 'bg-green-500' }
                ].map((stage, index) => (
                  <div key={index} className="relative">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{stage.stage}</span>
                      <span className="text-sm text-gray-600">{stage.count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${stage.color}`}
                        style={{ width: `${stage.rate}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{stage.rate}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tipos de Imóveis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-orange-700">
                <span className="mr-2 text-2xl">🏠</span>
                Tipos de Imóveis
              </CardTitle>
              <CardDescription>
                Interesse por categoria
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { type: 'Apartamento', count: 567, percentage: 45.5 },
                  { type: 'Casa', count: 312, percentage: 25.0 },
                  { type: 'Comercial', count: 189, percentage: 15.2 },
                  { type: 'Terreno', count: 134, percentage: 10.7 },
                  { type: 'Rural', count: 45, percentage: 3.6 }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="font-medium">{item.type}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{item.count}</span>
                      <span className="text-sm text-gray-500">({item.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Faixas de Preço */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-green-700">
                <span className="mr-2 text-2xl">💰</span>
                Faixas de Preço
              </CardTitle>
              <CardDescription>
                Distribuição por orçamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { range: 'Até R$ 300k', count: 234, percentage: 18.8 },
                  { range: 'R$ 300k - R$ 500k', count: 389, percentage: 31.2 },
                  { range: 'R$ 500k - R$ 800k', count: 312, percentage: 25.0 },
                  { range: 'R$ 800k - R$ 1.2M', count: 189, percentage: 15.2 },
                  { range: 'Acima de R$ 1.2M', count: 123, percentage: 9.8 }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="font-medium text-sm">{item.range}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{item.count}</span>
                      <span className="text-sm text-gray-500">({item.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Métricas de Atendimento */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* WhatsApp Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-green-700">
                <span className="mr-2 text-2xl">💬</span>
                Analytics WhatsApp
              </CardTitle>
              <CardDescription>
                Métricas de atendimento por WhatsApp
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">2,847</div>
                  <div className="text-sm text-gray-600">Mensagens Enviadas</div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">1,923</div>
                  <div className="text-sm text-gray-600">Mensagens Recebidas</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">94.2%</div>
                  <div className="text-sm text-gray-600">Taxa de Resposta</div>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">45s</div>
                  <div className="text-sm text-gray-600">Tempo Médio</div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Horários de Maior Atividade:</h4>
                {[
                  { time: '09:00 - 12:00', activity: 85 },
                  { time: '14:00 - 17:00', activity: 92 },
                  { time: '19:00 - 21:00', activity: 67 }
                ].map((slot, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{slot.time}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${slot.activity}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{slot.activity}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* IA Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-blue-700">
                <span className="mr-2 text-2xl">🤖</span>
                Performance da IA
              </CardTitle>
              <CardDescription>
                Métricas do assistente virtual
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">1,456</div>
                  <div className="text-sm text-gray-600">Interações IA</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">87.3%</div>
                  <div className="text-sm text-gray-600">Taxa de Sucesso</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">234</div>
                  <div className="text-sm text-gray-600">Leads Qualificados</div>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">4.2/5</div>
                  <div className="text-sm text-gray-600">Satisfação</div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Tipos de Consulta:</h4>
                {[
                  { type: 'Informações sobre imóveis', count: 567 },
                  { type: 'Agendamento de visitas', count: 234 },
                  { type: 'Dúvidas sobre financiamento', count: 189 },
                  { type: 'Documentação necessária', count: 123 }
                ].map((query, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{query.type}</span>
                    <span className="text-sm font-medium">{query.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-gray-700">
              <span className="mr-2 text-2xl">📤</span>
              Exportar Relatórios
            </CardTitle>
            <CardDescription>
              Baixe relatórios detalhados em diferentes formatos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
                <span className="text-2xl">📊</span>
                <span className="text-sm">Relatório Completo (PDF)</span>
              </Button>
              <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
                <span className="text-2xl">📈</span>
                <span className="text-sm">Dados para Excel</span>
              </Button>
              <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
                <span className="text-2xl">📧</span>
                <span className="text-sm">Enviar por Email</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ConfigLayout>
  )
}
