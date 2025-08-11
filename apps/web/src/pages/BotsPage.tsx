import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Bot, Play, Pause, Settings, BarChart3, MessageSquare } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { Loading } from '../components/Loading'

interface Bot {
  id: string
  name: string
  description?: string
  is_active: boolean
  mode: 'assistido' | 'avancado'
  created_at: string
  bot_flows: { count: number }[]
}

export function BotsPage() {
  const { session } = useAuth()
  const { toast } = useToast()
  const [bots, setBots] = useState<Bot[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newBotName, setNewBotName] = useState('')
  const [newBotDescription, setNewBotDescription] = useState('')
  const [newBotMode, setNewBotMode] = useState<'assistido' | 'avancado'>('assistido')
  const [createLoading, setCreateLoading] = useState(false)

  useEffect(() => {
    fetchBots()
  }, [])

  const fetchBots = async () => {
    try {
      const response = await fetch('/api/bots/bots', {
        headers: {
          'Authorization': `Bearer ${session?.access_token || ''}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setBots(data.bots)
      }
    } catch (error) {
      console.error('Erro ao buscar bots:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateBot = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreateLoading(true)

    try {
      const response = await fetch('/api/bots/bots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || ''}`
        },
        body: JSON.stringify({
          name: newBotName,
          description: newBotDescription,
          mode: newBotMode
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast('Bot criado com sucesso!', 'success')
        setNewBotName('')
        setNewBotDescription('')
        setShowCreateModal(false)
        fetchBots()
      } else {
        toast(data?.error || 'Erro ao criar bot', 'error')
      }
    } catch (err) {
      toast('Erro ao criar bot', 'error')
    } finally {
      setCreateLoading(false)
    }
  }

  const handleToggleBot = async (botId: string) => {
    try {
      const response = await fetch(`/api/bots/bots/${botId}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${session?.access_token || ''}`
        }
      })

      if (response.ok) {
        fetchBots()
      }
    } catch (error) {
      console.error('Erro ao alterar status do bot:', error)
    }
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bots de Atendimento</h1>
          <p className="text-gray-600">Gerencie seus assistentes virtuais com IA</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Bot
        </button>
      </div>

	      <div className="flex justify-end">
	        <button onClick={fetchBots} disabled={loading} className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50 disabled:opacity-50">
	          Recarregar
	        </button>
	      </div>



      {/* Lista de bots */}
      {bots.length === 0 ? (
        <div className="text-center py-12">
          <Bot className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum bot criado</h3>
          <p className="mt-1 text-sm text-gray-500">
            Comece criando seu primeiro bot de atendimento.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo Bot
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bots.map((bot) => (
            <div key={bot.id} className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Bot className={`h-8 w-8 ${bot.is_active ? 'text-green-500' : 'text-gray-400'}`} />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">{bot.name}</h3>
                    <p className="text-sm text-gray-500">{bot.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    bot.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {bot.is_active ? 'Ativo' : 'Inativo'}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    bot.mode === 'avancado'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {bot.mode === 'avancado' ? 'Avançado' : 'Assistido'}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center text-sm text-gray-500">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  <span>{bot.bot_flows?.[0]?.count || 0} fluxos</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex space-x-2">
                  <Link
                    to={`/bots/${bot.id}`}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Settings className="h-3 w-3 mr-1" />
                    Editar
                  </Link>
                  <Link
                    to={`/bots/${bot.id}/stats`}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <BarChart3 className="h-3 w-3 mr-1" />
                    Stats
                  </Link>
                </div>
                <button
                  onClick={() => handleToggleBot(bot.id)}
                  className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded ${
                    bot.is_active
                      ? 'text-red-700 bg-red-100 hover:bg-red-200'
                      : 'text-green-700 bg-green-100 hover:bg-green-200'
                  }`}
                >
                  {bot.is_active ? (
                    <>
                      <Pause className="h-3 w-3 mr-1" />
                      Pausar
                    </>
                  ) : (
                    <>
                      <Play className="h-3 w-3 mr-1" />
                      Ativar
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de criação */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Criar Novo Bot</h3>

              <form onSubmit={handleCreateBot} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Bot
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={newBotName}
                    onChange={(e) => setNewBotName(e.target.value)}
                    placeholder="Ex: Assistente Imobiliário"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição (opcional)
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={newBotDescription}
                    onChange={(e) => setNewBotDescription(e.target.value)}
                    placeholder="Descreva o propósito do bot..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Modo
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={newBotMode}
                    onChange={(e) => setNewBotMode(e.target.value as 'assistido' | 'avancado')}
                  >
                    <option value="assistido">Assistido (Recomendado)</option>
                    <option value="avancado">Avançado (Edição completa)</option>
                  </select>
                  <p className="mt-1 text-sm text-gray-500">
                    Modo assistido oferece templates prontos. Modo avançado permite edição completa.
                  </p>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={createLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
                  >
                    {createLoading ? 'Criando...' : 'Criar Bot'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
