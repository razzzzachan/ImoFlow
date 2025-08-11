import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Loading } from '../components/Loading'

interface BotStats {
  total_sessions: number
  active_sessions: number
  leads_created: number
  total_messages: number
}

export function BotStatsPage() {
  const { id } = useParams()
  const { session } = useAuth()
  const [stats, setStats] = useState<BotStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/bots/bots/${id}/stats`, {
        headers: { Authorization: `Bearer ${session?.access_token || ''}` }
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Erro ao carregar stats')
      setStats(json.data?.stats || json.stats)
      setError(null)
    } catch (e: any) {
      setError(e?.message || 'Erro ao carregar stats')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) load()
  }, [id, session?.access_token])

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">{error}</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Estatísticas do Bot</h1>
        <p className="text-gray-600">Visão geral do desempenho</p>
      </div>
      <div className="flex justify-end">
        <button onClick={load} disabled={loading} className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50 disabled:opacity-50">Recarregar</button>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
          <div className="text-sm text-gray-500">Sessões Totais</div>
          <div className="text-2xl font-semibold">{stats?.total_sessions ?? '—'}</div>
        </div>
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
          <div className="text-sm text-gray-500">Sessões Ativas</div>
          <div className="text-2xl font-semibold">{stats?.active_sessions ?? '—'}</div>
        </div>
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
          <div className="text-sm text-gray-500">Leads Criados</div>
          <div className="text-2xl font-semibold">{stats?.leads_created ?? '—'}</div>
        </div>
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
          <div className="text-sm text-gray-500">Mensagens</div>
          <div className="text-2xl font-semibold">{stats?.total_messages ?? '—'}</div>
        </div>
      </div>
    </div>
  )
}

