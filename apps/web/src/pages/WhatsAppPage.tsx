import { useState, useEffect } from 'react'
import { MessageSquare, Phone, Settings, BarChart3, Zap, QrCode } from 'lucide-react'

interface WhatsAppStatus {
  connected: boolean
  qrCode?: string
}

interface Metrics {
  messages: {
    inbound: number
    outbound: number
    total: number
  }
  leads: {
    total: number
    thisWeek: number
  }
}

export function WhatsAppPage() {
  const [status, setStatus] = useState<WhatsAppStatus>({ connected: false })
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState(false)
  const [autoResponse, setAutoResponse] = useState({
    enabled: false,
    message: 'Olá! Obrigado pelo seu contato. Em breve um de nossos consultores entrará em contato com você.',
    keywords: ['oi', 'olá', 'bom dia', 'boa tarde', 'boa noite']
  })

  useEffect(() => {
    fetchStatus()
    fetchMetrics()
  }, [])

  const fetchStatus = async () => {
    try {
      // Simular dados por enquanto - depois integrar com API
      setStatus({ connected: false })
    } catch (error) {
      console.error('Erro ao buscar status:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMetrics = async () => {
    try {
      // Simular dados por enquanto - depois integrar com API
      const mockMetrics: Metrics = {
        messages: {
          inbound: 45,
          outbound: 32,
          total: 77
        },
        leads: {
          total: 23,
          thisWeek: 8
        }
      }
      
      setMetrics(mockMetrics)
    } catch (error) {
      console.error('Erro ao buscar métricas:', error)
    }
  }

  const handleConnect = async () => {
    setConnecting(true)
    try {
      // Simular conexão - depois integrar com API
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simular QR Code
      setStatus({
        connected: false,
        qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
      })
    } catch (error) {
      console.error('Erro ao conectar:', error)
    } finally {
      setConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    try {
      // Integrar com API depois
      setStatus({ connected: false })
    } catch (error) {
      console.error('Erro ao desconectar:', error)
    }
  }

  const handleSaveAutoResponse = async () => {
    try {
      // Integrar com API depois
      console.log('Salvando resposta automática:', autoResponse)
    } catch (error) {
      console.error('Erro ao salvar resposta automática:', error)
    }
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">WhatsApp Business</h1>
        <p className="text-gray-600">Gerencie seu atendimento automatizado via WhatsApp</p>
      </div>

      {/* Status da Conexão */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Status da Conexão</h2>
          <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            status.connected 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${
              status.connected ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            {status.connected ? 'Conectado' : 'Desconectado'}
          </div>
        </div>

        {!status.connected && !status.qrCode && (
          <div className="text-center py-8">
            <Phone className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">WhatsApp não conectado</h3>
            <p className="text-gray-600 mb-4">
              Conecte seu WhatsApp para começar a receber e enviar mensagens automaticamente
            </p>
            <button
              onClick={handleConnect}
              disabled={connecting}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
            >
              {connecting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <QrCode className="mr-2 h-4 w-4" />
              )}
              {connecting ? 'Conectando...' : 'Conectar WhatsApp'}
            </button>
          </div>
        )}

        {status.qrCode && !status.connected && (
          <div className="text-center py-8">
            <QrCode className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Escaneie o QR Code</h3>
            <p className="text-gray-600 mb-4">
              Abra o WhatsApp no seu celular e escaneie o código abaixo
            </p>
            <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg">
              <img src={status.qrCode} alt="QR Code" className="w-48 h-48" />
            </div>
          </div>
        )}

        {status.connected && (
          <div className="text-center py-8">
            <MessageSquare className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">WhatsApp Conectado</h3>
            <p className="text-gray-600 mb-4">
              Seu WhatsApp está conectado e funcionando normalmente
            </p>
            <button
              onClick={handleDisconnect}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Desconectar
            </button>
          </div>
        )}
      </div>

      {/* Métricas */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Mensagens Recebidas</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.messages.inbound}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <MessageSquare className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Mensagens Enviadas</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.messages.outbound}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total de Mensagens</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.messages.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Zap className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Leads Gerados</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.leads.total}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Configuração de Resposta Automática */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Resposta Automática</h2>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="auto-response"
              checked={autoResponse.enabled}
              onChange={(e) => setAutoResponse(prev => ({ ...prev, enabled: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="auto-response" className="ml-2 text-sm text-gray-700">
              Ativar resposta automática
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mensagem de resposta automática
            </label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={autoResponse.message}
              onChange={(e) => setAutoResponse(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Digite a mensagem que será enviada automaticamente..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Palavras-chave (opcional)
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={autoResponse.keywords.join(', ')}
              onChange={(e) => setAutoResponse(prev => ({ 
                ...prev, 
                keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k)
              }))}
              placeholder="oi, olá, bom dia, boa tarde..."
            />
            <p className="mt-1 text-sm text-gray-500">
              Deixe vazio para responder a todas as mensagens, ou adicione palavras-chave separadas por vírgula
            </p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSaveAutoResponse}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Settings className="mr-2 h-4 w-4" />
              Salvar Configurações
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
