import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import ConfigLayout from '../components/ConfigLayout'

export default function GestaoLeads() {
  const navigate = useNavigate()
  const [selectedLead, setSelectedLead] = useState<any | null>(null)

  return (
    <ConfigLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-green-600 mb-2">
                🏢 Gestão de Leads
              </h1>
              <p className="text-gray-600">
                CRM completo para gerenciar leads e funil de vendas
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-green-100 text-green-800">
                127 Leads Ativos
              </Badge>
              <Button className="bg-green-600 hover:bg-green-700">
                ➕ Novo Lead
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total de Leads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">127</div>
              <p className="text-xs text-green-600">+12% vs ontem</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Novos Hoje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">8</div>
              <p className="text-xs text-gray-500">Últimas 24h</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Em Atendimento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">32</div>
              <p className="text-xs text-gray-500">Sendo atendidos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Visitas Marcadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">15</div>
              <p className="text-xs text-gray-500">Esta semana</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Taxa Conversão
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">23.5%</div>
              <p className="text-xs text-green-600">+2% vs semana</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Funil de Vendas */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-700">
                <span className="mr-2 text-2xl">📊</span>
                Funil de Vendas
              </CardTitle>
              <CardDescription>
                Acompanhe o progresso dos leads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { stage: 'Captado', count: 45, percentage: 35.4, color: 'bg-blue-500' },
                  { stage: 'Qualificado', count: 38, percentage: 29.9, color: 'bg-indigo-500' },
                  { stage: 'Em Atendimento', count: 32, percentage: 25.2, color: 'bg-yellow-500' },
                  { stage: 'Visita Marcada', count: 15, percentage: 11.8, color: 'bg-purple-500' },
                  { stage: 'Proposta', count: 8, percentage: 6.3, color: 'bg-orange-500' },
                  { stage: 'Fechado', count: 4, percentage: 3.1, color: 'bg-green-500' }
                ].map((stage, index) => (
                  <div key={index} className="relative">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{stage.stage}</span>
                      <span className="text-sm text-gray-600">{stage.count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${stage.color}`}
                        style={{ width: `${stage.percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{stage.percentage}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Lista de Leads */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center text-green-700">
                <span className="mr-2 text-2xl">👥</span>
                Leads Recentes
              </CardTitle>
              <CardDescription>
                Leads mais recentes e suas informações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {[
                  {
                    id: 1,
                    name: 'João Silva',
                    phone: '(11) 99999-1111',
                    email: 'joao@email.com',
                    status: 'visita_marcada',
                    score: 85,
                    source: 'WhatsApp',
                    interest: 'Apartamento 2 quartos',
                    budget: 'R$ 500k - R$ 800k',
                    agent: 'Maria Silva',
                    created: '2h atrás'
                  },
                  {
                    id: 2,
                    name: 'Maria Santos',
                    phone: '(11) 99999-2222',
                    email: 'maria@email.com',
                    status: 'proposta',
                    score: 92,
                    source: 'Website',
                    interest: 'Casa 3 quartos',
                    budget: 'R$ 800k - R$ 1.2M',
                    agent: 'João Costa',
                    created: '4h atrás'
                  },
                  {
                    id: 3,
                    name: 'Pedro Costa',
                    phone: '(11) 99999-3333',
                    email: 'pedro@email.com',
                    status: 'em_atendimento',
                    score: 78,
                    source: 'Instagram',
                    interest: 'Comercial',
                    budget: 'R$ 2M+',
                    agent: 'Ana Souza',
                    created: '6h atrás'
                  },
                  {
                    id: 4,
                    name: 'Ana Oliveira',
                    phone: '(11) 99999-4444',
                    email: 'ana@email.com',
                    status: 'qualificado',
                    score: 65,
                    source: 'Portal',
                    interest: 'Apartamento 1 quarto',
                    budget: 'R$ 300k - R$ 500k',
                    agent: 'Carlos Lima',
                    created: '8h atrás'
                  }
                ].map((lead) => (
                  <div 
                    key={lead.id} 
                    className="p-4 border rounded-lg bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => setSelectedLead(lead)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium text-sm">
                            {lead.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium">{lead.name}</h3>
                          <p className="text-sm text-gray-500">{lead.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">Score: {lead.score}</Badge>
                        <Badge className={
                          lead.status === 'visita_marcada' ? 'bg-purple-100 text-purple-800' :
                          lead.status === 'proposta' ? 'bg-orange-100 text-orange-800' :
                          lead.status === 'em_atendimento' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }>
                          {lead.status === 'visita_marcada' ? 'Visita Marcada' :
                           lead.status === 'proposta' ? 'Proposta' :
                           lead.status === 'em_atendimento' ? 'Em Atendimento' :
                           'Qualificado'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Interesse:</span>
                        <span className="font-medium ml-2">{lead.interest}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Orçamento:</span>
                        <span className="font-medium ml-2">{lead.budget}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Fonte:</span>
                        <span className="font-medium ml-2">{lead.source}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Corretor:</span>
                        <span className="font-medium ml-2">{lead.agent}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-gray-500">{lead.created}</span>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          📞 Ligar
                        </Button>
                        <Button size="sm" variant="outline">
                          💬 WhatsApp
                        </Button>
                        <Button size="sm" variant="outline">
                          ✏️ Editar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">Mostrando 4 de 127 leads</span>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">← Anterior</Button>
                  <Button size="sm" variant="outline">Próximo →</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance da Equipe */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-purple-700">
                <span className="mr-2 text-2xl">👥</span>
                Performance da Equipe
              </CardTitle>
              <CardDescription>
                Acompanhe o desempenho dos corretores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  {
                    name: 'Maria Silva',
                    avatar: 'MS',
                    leads_ativos: 15,
                    conversao: 28.5,
                    vendas_mes: 3,
                    meta: 5,
                    color: 'bg-green-100 text-green-800'
                  },
                  {
                    name: 'João Costa',
                    avatar: 'JC',
                    leads_ativos: 12,
                    conversao: 22.1,
                    vendas_mes: 2,
                    meta: 4,
                    color: 'bg-blue-100 text-blue-800'
                  },
                  {
                    name: 'Ana Souza',
                    avatar: 'AS',
                    leads_ativos: 18,
                    conversao: 31.2,
                    vendas_mes: 4,
                    meta: 5,
                    color: 'bg-purple-100 text-purple-800'
                  },
                  {
                    name: 'Carlos Lima',
                    avatar: 'CL',
                    leads_ativos: 8,
                    conversao: 18.7,
                    vendas_mes: 1,
                    meta: 3,
                    color: 'bg-orange-100 text-orange-800'
                  }
                ].map((agent, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-white">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${agent.color}`}>
                        <span className="font-medium">{agent.avatar}</span>
                      </div>
                      <div>
                        <h3 className="font-medium">{agent.name}</h3>
                        <p className="text-sm text-gray-500">Corretor</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Leads Ativos:</span>
                        <span className="font-medium">{agent.leads_ativos}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Conversão:</span>
                        <span className="font-medium text-green-600">{agent.conversao}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Vendas/Mês:</span>
                        <span className="font-medium">{agent.vendas_mes}/{agent.meta}</span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${(agent.vendas_mes / agent.meta) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 text-center">
                        {Math.round((agent.vendas_mes / agent.meta) * 100)}% da meta
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>🚀 Ações Rápidas - CRM</CardTitle>
              <CardDescription>
                Acesse rapidamente as funcionalidades do CRM
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  variant="outline"
                  onClick={() => {/* Abrir modal de novo lead */}}
                >
                  <span className="text-2xl">➕</span>
                  <span className="text-sm">Novo Lead</span>
                </Button>
                <Button
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  variant="outline"
                  onClick={() => navigate('/dashboard/relatorios')}
                >
                  <span className="text-2xl">📊</span>
                  <span className="text-sm">Relatórios</span>
                </Button>
                <Button
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  variant="outline"
                  onClick={() => {/* Abrir modal de importação */}}
                >
                  <span className="text-2xl">📤</span>
                  <span className="text-sm">Importar Leads</span>
                </Button>
                <Button
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  variant="outline"
                  onClick={() => {/* Abrir configuração do funil */}}
                >
                  <span className="text-2xl">⚙️</span>
                  <span className="text-sm">Config Funil</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ConfigLayout>
  )
}
