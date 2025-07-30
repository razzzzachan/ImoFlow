import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Phone, Mail, MapPin, DollarSign, Calendar, MessageSquare, Plus, User } from 'lucide-react'

interface Lead {
  id: string
  name: string
  email?: string
  phone?: string
  whatsapp?: string
  property_type?: string
  location?: string
  budget_min?: number
  budget_max?: number
  status: string
  source: string
  priority: string
  lead_score: number
  last_contact?: string
  next_followup?: string
  created_at: string
  assigned_user?: {
    name: string
    email: string
    avatar_url?: string
  }
  interactions?: Interaction[]
  tasks?: Task[]
  status_history?: StatusHistory[]
}

interface Interaction {
  id: string
  type: string
  content: string
  created_at: string
  user?: {
    name: string
    avatar_url?: string
  }
}

interface Task {
  id: string
  title: string
  description?: string
  due_date?: string
  completed: boolean
  priority: string
}

interface StatusHistory {
  id: string
  from_status: string
  to_status: string
  created_at: string
  reason?: string
  changed_by_user?: {
    name: string
  }
}

export function LeadDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [lead, setLead] = useState<Lead | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('interactions')
  const [newNote, setNewNote] = useState('')
  const [addingNote, setAddingNote] = useState(false)

  useEffect(() => {
    if (id) {
      fetchLead()
    }
  }, [id])

  const fetchLead = async () => {
    try {
      const response = await fetch(`/api/crm/leads/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setLead(data.lead)
      }
    } catch (error) {
      console.error('Erro ao buscar lead:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddNote = async () => {
    if (!newNote.trim() || !id) return

    setAddingNote(true)
    try {
      const response = await fetch(`/api/crm/leads/${id}/interactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`
        },
        body: JSON.stringify({
          type: 'note',
          content: newNote
        })
      })

      if (response.ok) {
        setNewNote('')
        fetchLead() // Recarregar dados
      }
    } catch (error) {
      console.error('Erro ao adicionar nota:', error)
    } finally {
      setAddingNote(false)
    }
  }

  const formatCurrency = (value?: number) => {
    if (!value) return 'Não informado'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR')
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      captado: 'bg-gray-100 text-gray-800',
      em_atendimento: 'bg-blue-100 text-blue-800',
      visita_marcada: 'bg-yellow-100 text-yellow-800',
      proposta: 'bg-orange-100 text-orange-800',
      negociacao: 'bg-purple-100 text-purple-800',
      fechado: 'bg-green-100 text-green-800',
      perdido: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    }
    return colors[priority] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!lead) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Lead não encontrado</h2>
        <Link to="/crm" className="text-blue-600 hover:text-blue-500">
          Voltar para CRM
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/crm"
            className="inline-flex items-center text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{lead.name}</h1>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                {lead.status.replace('_', ' ')}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(lead.priority)}`}>
                {lead.priority}
              </span>
              <span className="text-sm text-gray-500">
                Score: {lead.lead_score}/100
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Informações principais */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informações de Contato</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lead.phone && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{lead.phone}</span>
                </div>
              )}
              
              {lead.email && (
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{lead.email}</span>
                </div>
              )}
              
              {lead.location && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{lead.location}</span>
                </div>
              )}
              
              {(lead.budget_min || lead.budget_max) && (
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                  <span>
                    {lead.budget_min && lead.budget_max
                      ? `${formatCurrency(lead.budget_min)} - ${formatCurrency(lead.budget_max)}`
                      : formatCurrency(lead.budget_min || lead.budget_max)
                    }
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Detalhes</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-500">Fonte:</span>
                <span className="ml-2 font-medium">{lead.source}</span>
              </div>
              <div>
                <span className="text-gray-500">Tipo de imóvel:</span>
                <span className="ml-2 font-medium">{lead.property_type || 'Não especificado'}</span>
              </div>
              <div>
                <span className="text-gray-500">Criado em:</span>
                <span className="ml-2">{formatDate(lead.created_at)}</span>
              </div>
              {lead.last_contact && (
                <div>
                  <span className="text-gray-500">Último contato:</span>
                  <span className="ml-2">{formatDate(lead.last_contact)}</span>
                </div>
              )}
            </div>
          </div>

          {lead.assigned_user && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Responsável</h3>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {lead.assigned_user.name.charAt(0)}
                    </span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{lead.assigned_user.name}</p>
                  <p className="text-sm text-gray-500">{lead.assigned_user.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('interactions')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'interactions'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <MessageSquare className="h-4 w-4 inline mr-2" />
            Interações ({lead.interactions?.length || 0})
          </button>
          
          <button
            onClick={() => setActiveTab('history')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'history'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Calendar className="h-4 w-4 inline mr-2" />
            Histórico
          </button>
        </nav>
      </div>

      {/* Conteúdo das tabs */}
      <div className="bg-white rounded-lg shadow">
        {activeTab === 'interactions' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Interações</h3>
              <div className="flex space-x-2">
                <textarea
                  rows={2}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Adicionar nota..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                />
                <button
                  onClick={handleAddNote}
                  disabled={addingNote || !newNote.trim()}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  {addingNote ? 'Salvando...' : 'Adicionar'}
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              {lead.interactions && lead.interactions.length > 0 ? (
                lead.interactions.map((interaction) => (
                  <div key={interaction.id} className="border-l-4 border-blue-200 pl-4 py-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{interaction.content}</p>
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <span className="capitalize">{interaction.type}</span>
                          {interaction.user && (
                            <>
                              <span className="mx-1">•</span>
                              <span>{interaction.user.name}</span>
                            </>
                          )}
                          <span className="mx-1">•</span>
                          <span>{formatDate(interaction.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Nenhuma interação registrada
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Histórico de Status</h3>
            
            <div className="space-y-4">
              {lead.status_history && lead.status_history.length > 0 ? (
                lead.status_history.map((history) => (
                  <div key={history.id} className="border-l-4 border-gray-200 pl-4 py-2">
                    <p className="text-sm text-gray-900">
                      Status alterado de <span className="font-medium">{history.from_status}</span> para{' '}
                      <span className="font-medium">{history.to_status}</span>
                    </p>
                    {history.reason && (
                      <p className="text-sm text-gray-600 mt-1">Motivo: {history.reason}</p>
                    )}
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      {history.changed_by_user && (
                        <>
                          <span>{history.changed_by_user.name}</span>
                          <span className="mx-1">•</span>
                        </>
                      )}
                      <span>{formatDate(history.created_at)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Nenhum histórico de mudanças
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
