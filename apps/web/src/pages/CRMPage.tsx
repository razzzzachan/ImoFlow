import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Filter, Phone, Mail, MapPin, DollarSign } from 'lucide-react'

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
  created_at: string
  assigned_user?: {
    name: string
    email: string
  }
}

const statusColumns = [
  { id: 'captado', title: 'Captado', color: 'bg-gray-100' },
  { id: 'em_atendimento', title: 'Em Atendimento', color: 'bg-blue-100' },
  { id: 'visita_marcada', title: 'Visita Marcada', color: 'bg-yellow-100' },
  { id: 'proposta', title: 'Proposta', color: 'bg-orange-100' },
  { id: 'negociacao', title: 'Negociação', color: 'bg-purple-100' },
  { id: 'fechado', title: 'Fechado', color: 'bg-green-100' },
  { id: 'perdido', title: 'Perdido', color: 'bg-red-100' }
]

export function CRMPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/crm/leads', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setLeads(data.leads || [])
      } else {
        console.error('Erro ao buscar leads')
      }
    } catch (error) {
      console.error('Erro ao buscar leads:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.phone?.includes(searchTerm)
    
    const matchesStatus = !selectedStatus || lead.status === selectedStatus
    
    return matchesSearch && matchesStatus
  })

  const getLeadsByStatus = (status: string) => {
    return filteredLeads.filter(lead => lead.status === status)
  }

  const formatCurrency = (value?: number) => {
    if (!value) return 'Não informado'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CRM - Funil de Vendas</h1>
          <p className="text-gray-600">Gerencie seus leads e oportunidades</p>
        </div>
        <button className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Novo Lead
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar leads..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="sm:w-48">
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">Todos os status</option>
            {statusColumns.map(status => (
              <option key={status.id} value={status.id}>{status.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Funil Kanban */}
      <div className="overflow-x-auto">
        <div className="flex space-x-4 pb-4" style={{ minWidth: '1400px' }}>
          {statusColumns.map(column => {
            const columnLeads = getLeadsByStatus(column.id)
            return (
              <div key={column.id} className="flex-shrink-0 w-80">
                <div className={`${column.color} rounded-lg p-4`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">{column.title}</h3>
                    <span className="bg-white px-2 py-1 rounded-full text-xs font-medium text-gray-600">
                      {columnLeads.length}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    {columnLeads.map(lead => (
                      <Link
                        key={lead.id}
                        to={`/crm/leads/${lead.id}`}
                        className="block bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900 truncate">{lead.name}</h4>
                          <span className="text-xs text-gray-500 ml-2">{formatDate(lead.created_at)}</span>
                        </div>
                        
                        <div className="space-y-1 text-sm text-gray-600">
                          {lead.phone && (
                            <div className="flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              <span className="truncate">{lead.phone}</span>
                            </div>
                          )}
                          
                          {lead.email && (
                            <div className="flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              <span className="truncate">{lead.email}</span>
                            </div>
                          )}
                          
                          {lead.location && (
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span className="truncate">{lead.location}</span>
                            </div>
                          )}
                          
                          {(lead.budget_min || lead.budget_max) && (
                            <div className="flex items-center">
                              <DollarSign className="h-3 w-3 mr-1" />
                              <span className="truncate">
                                {lead.budget_min && lead.budget_max
                                  ? `${formatCurrency(lead.budget_min)} - ${formatCurrency(lead.budget_max)}`
                                  : formatCurrency(lead.budget_min || lead.budget_max)
                                }
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                          <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                            {lead.property_type || 'Não especificado'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {lead.source}
                          </span>
                        </div>
                        
                        {lead.assigned_user && (
                          <div className="mt-2 text-xs text-gray-500">
                            Responsável: {lead.assigned_user.name}
                          </div>
                        )}
                      </Link>
                    ))}
                    
                    {columnLeads.length === 0 && (
                      <div className="text-center py-8 text-gray-500 text-sm">
                        Nenhum lead neste status
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
