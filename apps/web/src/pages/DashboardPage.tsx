import { useEffect, useState } from 'react'
import { Users, MessageSquare, CheckCircle, TrendingUp } from 'lucide-react'

interface Stats {
  leads: {
    total: number
    byStatus: Record<string, number>
  }
  tasks: {
    pending: number
  }
  interactions: {
    today: number
  }
}

export function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // Simular dados por enquanto - depois integrar com API
      const mockStats: Stats = {
        leads: {
          total: 45,
          byStatus: {
            novo: 12,
            contato_inicial: 8,
            qualificado: 15,
            proposta: 6,
            negociacao: 3,
            fechado: 1
          }
        },
        tasks: {
          pending: 23
        },
        interactions: {
          today: 18
        }
      }
      
      setStats(mockStats)
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const statusColors: Record<string, string> = {
    novo: 'bg-gray-500',
    contato_inicial: 'bg-blue-500',
    qualificado: 'bg-yellow-500',
    proposta: 'bg-orange-500',
    negociacao: 'bg-purple-500',
    fechado: 'bg-green-500'
  }

  const statusLabels: Record<string, string> = {
    novo: 'Novo',
    contato_inicial: 'Contato Inicial',
    qualificado: 'Qualificado',
    proposta: 'Proposta',
    negociacao: 'Negociação',
    fechado: 'Fechado'
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Visão geral do seu CRM imobiliário</p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total de Leads</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.leads.total || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Tarefas Pendentes</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.tasks.pending || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <MessageSquare className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Interações Hoje</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.interactions.today || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Taxa de Conversão</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.leads.total ? 
                  Math.round(((stats.leads.byStatus.fechado || 0) / stats.leads.total) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de leads por status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Leads por Status</h3>
          <div className="space-y-3">
            {stats?.leads.byStatus && Object.entries(stats.leads.byStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${statusColors[status]} mr-3`}></div>
                  <span className="text-sm text-gray-700">{statusLabels[status]}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Atividades recentes */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Atividades Recentes</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Novo lead recebido via WhatsApp</p>
                <p className="text-xs text-gray-500">2 minutos atrás</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Lead movido para "Qualificado"</p>
                <p className="text-xs text-gray-500">15 minutos atrás</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Tarefa de follow-up criada</p>
                <p className="text-xs text-gray-500">1 hora atrás</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Áudio processado pela IA</p>
                <p className="text-xs text-gray-500">2 horas atrás</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
