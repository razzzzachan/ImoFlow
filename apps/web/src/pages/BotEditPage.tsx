import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Save, Play, Pause, Plus, MessageSquare, Settings, Users } from 'lucide-react'

interface Bot {
  id: string
  name: string
  description?: string
  is_active: boolean
  mode: 'assistido' | 'avancado'
  config: any
  bot_flows: Flow[]
}

interface Flow {
  id: string
  name: string
  is_default: boolean
  bot_blocks: Block[]
}

interface Block {
  id: string
  block_type: string
  name: string
  config: any
  position_x: number
  position_y: number
}

export function BotEditPage() {
  const { id } = useParams<{ id: string }>()
  const [bot, setBot] = useState<Bot | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('config')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (id) {
      fetchBot()
    }
  }, [id])

  const fetchBot = async () => {
    try {
      const response = await fetch(`/api/bots/bots/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setBot(data.bot)
      } else {
        setError('Bot não encontrado')
      }
    } catch (error) {
      console.error('Erro ao buscar bot:', error)
      setError('Erro ao carregar bot')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!bot) return

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`/api/bots/bots/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`
        },
        body: JSON.stringify({
          name: bot.name,
          description: bot.description,
          config: bot.config
        })
      })

      if (response.ok) {
        setSuccess('Bot salvo com sucesso!')
      } else {
        const data = await response.json()
        setError(data.error)
      }
    } catch (err) {
      setError('Erro ao salvar bot')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleBot = async () => {
    if (!bot) return

    try {
      const response = await fetch(`/api/bots/bots/${id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`
        }
      })

      if (response.ok) {
        setBot({ ...bot, is_active: !bot.is_active })
      }
    } catch (error) {
      console.error('Erro ao alterar status do bot:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!bot) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Bot não encontrado</h2>
        <Link to="/bots" className="text-blue-600 hover:text-blue-500">
          Voltar para bots
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
            to="/bots"
            className="inline-flex items-center text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{bot.name}</h1>
            <p className="text-gray-600">{bot.description}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            bot.is_active 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {bot.is_active ? 'Ativo' : 'Inativo'}
          </span>
          
          <button
            onClick={handleToggleBot}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
              bot.is_active
                ? 'text-red-700 bg-red-100 hover:bg-red-200'
                : 'text-green-700 bg-green-100 hover:bg-green-200'
            }`}
          >
            {bot.is_active ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pausar Bot
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Ativar Bot
              </>
            )}
          </button>
          
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>

      {/* Mensagens */}
      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">{error}</div>
      )}
      
      {success && (
        <div className="text-green-600 text-sm bg-green-50 p-3 rounded-md">{success}</div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('config')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'config'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Settings className="h-4 w-4 inline mr-2" />
            Configurações
          </button>
          
          <button
            onClick={() => setActiveTab('flows')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'flows'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <MessageSquare className="h-4 w-4 inline mr-2" />
            Fluxos ({bot.bot_flows?.length || 0})
          </button>
          
          <button
            onClick={() => setActiveTab('sessions')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'sessions'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Users className="h-4 w-4 inline mr-2" />
            Sessões Ativas
          </button>
        </nav>
      </div>

      {/* Conteúdo das tabs */}
      <div className="bg-white rounded-lg shadow p-6">
        {activeTab === 'config' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Configurações Gerais</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Bot
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={bot.name}
                    onChange={(e) => setBot({ ...bot, name: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Modo
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={bot.mode}
                    disabled // Não permitir alterar após criação
                  >
                    <option value="assistido">Assistido</option>
                    <option value="avancado">Avançado</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={bot.description || ''}
                  onChange={(e) => setBot({ ...bot, description: e.target.value })}
                />
              </div>
            </div>

            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Configurações de IA</h4>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="ai_enabled"
                    checked={bot.config?.ai_enabled || false}
                    onChange={(e) => setBot({
                      ...bot,
                      config: { ...bot.config, ai_enabled: e.target.checked }
                    })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="ai_enabled" className="ml-2 text-sm text-gray-700">
                    Habilitar análise com IA
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensagem de boas-vindas
                  </label>
                  <textarea
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={bot.config?.welcome_message || ''}
                    onChange={(e) => setBot({
                      ...bot,
                      config: { ...bot.config, welcome_message: e.target.value }
                    })}
                    placeholder="Olá! Como posso ajudá-lo?"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensagem de fallback
                  </label>
                  <textarea
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={bot.config?.fallback_message || ''}
                    onChange={(e) => setBot({
                      ...bot,
                      config: { ...bot.config, fallback_message: e.target.value }
                    })}
                    placeholder="Desculpe, não entendi. Pode repetir?"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'flows' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Fluxos de Conversação</h3>
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Novo Fluxo
              </button>
            </div>
            
            {bot.bot_flows && bot.bot_flows.length > 0 ? (
              <div className="space-y-4">
                {bot.bot_flows.map((flow) => (
                  <div key={flow.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{flow.name}</h4>
                        <p className="text-sm text-gray-500">
                          {flow.bot_blocks?.length || 0} blocos
                          {flow.is_default && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              Padrão
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 text-sm">
                          Editar
                        </button>
                        {!flow.is_default && (
                          <button className="text-red-600 hover:text-red-900 text-sm">
                            Excluir
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum fluxo encontrado</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Crie um fluxo para começar a configurar seu bot.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'sessions' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-6">Sessões Ativas</h3>
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma sessão ativa</h3>
              <p className="mt-1 text-sm text-gray-500">
                As conversas ativas aparecerão aqui.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
