import { useState, useEffect } from 'react'
import { Plus, Search, Phone, Mail, MapPin, DollarSign } from 'lucide-react'
import { getLeads, createLead, updateLead, assignLead, bulkUpdateStatus, type Lead } from '../lib/api/crm'
import { useAuth } from '../contexts/AuthContext'
import { getUsers, type AuthUser } from '../lib/api/auth'
import { useToast } from '../contexts/ToastContext'
import { Loading } from '../components/Loading'


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
  const { session } = useAuth()
  const [showNewLead, setShowNewLead] = useState(false)
  const [form, setForm] = useState<{ name: string; email?: string; phone?: string; source?: string }>({ name: '', email: '', phone: '', source: 'manual' })
  const [showEditLead, setShowEditLead] = useState(false)
  const [editForm, setEditForm] = useState<{ id?: string; name: string; email?: string; phone?: string; source?: string }>({ id: '', name: '', email: '', phone: '', source: 'manual' })
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [loadingAction, setLoadingAction] = useState(false)
  const { toast: notify } = useToast()
  const [assignForm, setAssignForm] = useState<{ leadId?: string; userId?: string; query: string }>({ query: '' })
  const [showAssign, setShowAssign] = useState(false)
  const [users, setUsers] = useState<AuthUser[]>([])


  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')

  useEffect(() => {
    fetchLeads()
    ;(async () => {
      try {
        if (!session?.access_token) return
        const list = await getUsers(session.access_token)
        setUsers(list)
      } catch (e) {
        // noop
      }
    })()
  }, [])

  const fetchLeads = async () => {
    try {
      if (!session?.access_token) return
      const { leads } = await getLeads(session.access_token, {
        status: selectedStatus
      })
      setLeads(leads)
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

  const refresh = async () => {
    setLoading(true)
    await fetchLeads()
  }

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
    return <Loading />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CRM - Funil de Vendas</h1>
          <p className="text-gray-600">Gerencie seus leads e oportunidades</p>
        </div>
        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          <button
            onClick={refresh}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-700 hover:bg-gray-800"
          >
            Atualizar
          </button>
          <button
            onClick={() => setShowNewLead(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Lead
          </button>
        </div>
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
              onKeyDown={(e) => e.key === 'Enter' && refresh()}
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
                    <button
                      onClick={async () => {
                        if (!session?.access_token) return
                        await bulkUpdateStatus(session.access_token, columnLeads.map(l => l.id), column.id)
                        await refresh()
                      }}
                      className="bg-white px-2 py-1 rounded-full text-xs font-medium text-gray-600 hover:bg-gray-200"
                    >
                      Atualizar status
                    </button>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-700">Selecionados: {selectedIds.filter(id => columnLeads.some(l => l.id === id)).length}</span>
                    <div className="space-x-2">
                      <button
                        onClick={() => setSelectedIds(prev => Array.from(new Set([...prev, ...columnLeads.map(l => l.id)])))}
                        className="text-xs px-2 py-1 border rounded hover:bg-gray-50 mr-2"
                      >
                        Selecionar todos
                      </button>
                      <button
                        onClick={() => setSelectedIds(prev => prev.filter(id => !columnLeads.some(l => l.id === id)))}
                        className="text-xs px-2 py-1 border rounded hover:bg-gray-50 mr-2"
                      >
                        Limpar seleção
                      </button>
                      {['captado','em_atendimento','visita_marcada','proposta','negociacao','fechado','perdido'].map(s => (
                        <button
                          key={s}
                          onClick={async () => {
                            if (!session?.access_token) return
                            const ids = selectedIds.filter(id => columnLeads.some(l => l.id === id))
                            if (ids.length === 0) return
                            try {
                              setLoadingAction(true)
                              const results = await bulkUpdateStatus(session.access_token, ids, s)
                              const ok = results.filter((r: any) => r.success).length
                              const fail = results.length - ok
                              notify(`Bulk: ${ok} ok, ${fail} falhas`)
                              await refresh()
                            } catch (e: any) {
                              notify(e?.message || 'Erro no bulk status')
                            } finally {
                              setLoadingAction(false)
                            }
                          }}
                          className="text-xs px-2 py-1 border rounded hover:bg-gray-50"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {columnLeads.map(lead => (
                      <div
                        key={lead.id}
                        className={`bg-white rounded-lg p-4 shadow-sm border transition-shadow ${selectedIds.includes(lead.id) ? 'border-blue-400 shadow-md' : 'border-gray-200 hover:shadow-md'}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <input
                            type="checkbox"
                            className="mr-2 mt-1"
                            checked={selectedIds.includes(lead.id)}
                            onChange={(e) => {
                              setSelectedIds(prev => e.target.checked ? [...prev, lead.id] : prev.filter(id => id !== lead.id))
                            }}
                          />
                          <h4
                            className="font-medium text-gray-900 truncate cursor-pointer"
                            onClick={() => {
                              setShowEditLead(true)
                              setEditForm({ id: lead.id, name: lead.name, email: lead.email, phone: lead.phone, source: lead.source })
                            }}
                          >
                            {lead.name}
                          </h4>
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
                          <div className="flex items-center gap-2">
                            <button
                              disabled={loadingAction}
                              onClick={async (e) => {
                                e.preventDefault()
                                if (!session?.access_token) return
                                try {
                                  setLoadingAction(true)
                                  await updateLead(session.access_token, lead.id, { status: column.id })
                                  notify('Status atualizado')
                                  await refresh()
                                } catch (err: any) {
                                  notify(err?.message || 'Erro ao atualizar lead')
                                } finally {
                                  setLoadingAction(false)
                                }
                              }}
                              className="text-xs text-blue-600 hover:underline disabled:opacity-50"
                            >
                              Mover p/ {column.title}
                            </button>
                            <span className="text-xs text-gray-500">
                              {lead.source}
                            </span>
                            <button
                              className="text-xs text-gray-600 hover:underline"
                              onClick={() => {
                                setAssignForm({ leadId: lead.id, query: '' })
                                setShowAssign(true)
                              }}
                            >
                              Atribuir
                            </button>
                          </div>
                        </div>
                        
                        {lead.assigned_user && (
                          <div className="mt-2 text-xs text-gray-500">
                            Responsável: {lead.assigned_user.name}
                          </div>
                        )}
                      </div>
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

      {showNewLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md animate-in zoom-in-95">
            <h3 className="text-lg font-semibold mb-4">Novo Lead</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Nome</label>
                <input
                  className="w-full border rounded-md px-3 py-2"
                  value={form.name}
                  onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Nome do lead"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Email</label>
                <input
                  className="w-full border rounded-md px-3 py-2"
                  value={form.email}
                  onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="email@exemplo.com"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Telefone</label>
                <input
                  className="w-full border rounded-md px-3 py-2"
                  value={form.phone}
                  onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Origem</label>
                <select
                  className="w-full border rounded-md px-3 py-2"
                  value={form.source}
                  onChange={(e) => setForm(f => ({ ...f, source: e.target.value }))}
                >
                  <option value="manual">Manual</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="site">Site</option>
                  <option value="indicacao">Indicação</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowNewLead(false)}
                  className="px-4 py-2 text-sm border rounded-md"
                >
                  Cancelar
                </button>
                <button
                  onClick={async () => {
                    try {
                      if (!session?.access_token) return
                      const lead = await createLead(session.access_token, form)
                      notify('Lead criado com sucesso')
                      setShowNewLead(false)
                      setForm({ name: '', email: '', phone: '', source: 'manual' })
                      await refresh()
                    } catch (e: any) {
                      notify(e?.message || 'Erro ao criar lead')
                    }
                  }}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md animate-in zoom-in-95">
            <h3 className="text-lg font-semibold mb-4">Editar Lead</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Nome</label>
                <input className="w-full border rounded-md px-3 py-2" value={editForm.name} onChange={(e) => setEditForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Email</label>
                <input className="w-full border rounded-md px-3 py-2" value={editForm.email} onChange={(e) => setEditForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Telefone</label>
                <input className="w-full border rounded-md px-3 py-2" value={editForm.phone} onChange={(e) => setEditForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Origem</label>
                <select className="w-full border rounded-md px-3 py-2" value={editForm.source} onChange={(e) => setEditForm(f => ({ ...f, source: e.target.value }))}>
                  <option value="manual">Manual</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="site">Site</option>
                  <option value="indicacao">Indicação</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setShowEditLead(false)} className="px-4 py-2 text-sm border rounded-md">Cancelar</button>
                <button
                  onClick={async () => {
                    if (!session?.access_token || !editForm.id) return
                    try {
                      setLoadingAction(true)
                      await updateLead(session.access_token, editForm.id, { name: editForm.name, email: editForm.email, phone: editForm.phone, source: editForm.source })
                      notify('Lead atualizado')
                      setShowEditLead(false)
                      await refresh()
                    } catch (e: any) {
                      notify(e?.message || 'Erro ao atualizar lead')
                    } finally {
                      setLoadingAction(false)
                    }
                  }}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md disabled:opacity-50"
                  disabled={loadingAction}
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAssign && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md animate-in zoom-in-95">
            <h3 className="text-lg font-semibold mb-4">Atribuir Lead</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Usuário</label>
                <input
                  className="w-full border rounded-md px-3 py-2 mb-2"
                  value={assignForm.query}
                  onChange={(e) => setAssignForm(f => ({ ...f, query: e.target.value }))}
                  placeholder="Buscar por nome ou email"
                />
                <div className="max-h-40 overflow-y-auto border rounded">
                  {users
                    .filter(u => !assignForm.query || u.name.toLowerCase().includes(assignForm.query.toLowerCase()) || u.email.toLowerCase().includes(assignForm.query.toLowerCase()))
                    .slice(0, 10)
                    .map(u => (
                      <button
                        key={u.id}
                        onClick={() => setAssignForm(f => ({ ...f, userId: u.id, query: `${u.name} <${u.email}>` }))}
                        className={`w-full text-left px-3 py-2 hover:bg-gray-50 ${assignForm.userId === u.id ? 'bg-blue-50' : ''}`}
                      >
                        <div className="text-sm font-medium">{u.name}</div>
                        <div className="text-xs text-gray-600">{u.email} • {u.role}</div>
                      </button>
                    ))}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setShowAssign(false)} className="px-4 py-2 text-sm border rounded-md">Cancelar</button>
                <button
                  onClick={async () => {
                    if (!session?.access_token || !assignForm.leadId || !assignForm.userId) return
                    try {
                      setLoadingAction(true)
                      await assignLead(session.access_token, assignForm.leadId, assignForm.userId)
                      notify('Lead atribuído')
                      setShowAssign(false)
                      setAssignForm({ query: '' })
                      await refresh()
                    } catch (e: any) {
                      notify(e?.message || 'Erro ao atribuir lead')
                    } finally {
                      setLoadingAction(false)
                    }
                  }}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md disabled:opacity-50"
                  disabled={loadingAction}
                >
                  Atribuir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
