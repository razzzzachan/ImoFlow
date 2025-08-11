import { useEffect, useState } from 'react'
import { useToast } from '../../contexts/ToastContext'
import { useAuth } from '../../contexts/AuthContext'

export function PreferencesSection() {
  const { toast } = useToast()
  const { session, user } = useAuth()
  const [intervalMs, setIntervalMs] = useState('30000')
  const [okBadgeMs, setOkBadgeMs] = useState('3000')
  const [cIntervalMs, setCIntervalMs] = useState('30000')
  const [cOkBadgeMs, setCOkBadgeMs] = useState('3000')
  const [loading, setLoading] = useState(false)
  const isAdmin = !!user && ['admin','gestor'].includes(user.role || '')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/settings/preferences', {
          headers: { Authorization: `Bearer ${session?.access_token || ''}` }
        })
        if (res.ok) {
          const { data } = await res.json()
          const prefs = data?.preferences || {}
          const i = String(prefs.api_health_interval_ms ?? localStorage.getItem('prefs:api_health_interval_ms') ?? '30000')
          const o = String(prefs.api_health_ok_ms ?? localStorage.getItem('prefs:api_health_ok_ms') ?? '3000')
          setIntervalMs(i)
          setOkBadgeMs(o)
          setCIntervalMs(i)
          setCOkBadgeMs(o)
        } else {
          // fallback local
          const i = String(localStorage.getItem('prefs:api_health_interval_ms') ?? '30000')
          const o = String(localStorage.getItem('prefs:api_health_ok_ms') ?? '3000')
          setIntervalMs(i)
          setOkBadgeMs(o)
          setCIntervalMs(i)
          setCOkBadgeMs(o)
        }
      } catch {
        const i = String(localStorage.getItem('prefs:api_health_interval_ms') ?? '30000')
        const o = String(localStorage.getItem('prefs:api_health_ok_ms') ?? '3000')
        setIntervalMs(i)
        setOkBadgeMs(o)
        setCIntervalMs(i)
        setCOkBadgeMs(o)
      }
    }
    load()
  }, [session?.access_token])

  const save = async () => {
    try {
      setLoading(true)
      const i = parseInt(intervalMs, 10)
      const o = parseInt(okBadgeMs, 10)
      if (!Number.isFinite(i) || i <= 0) throw new Error('Intervalo inválido')
      if (!Number.isFinite(o) || o < 0) throw new Error('Duração inválida')

      // salvar na API (usuário)
      const res = await fetch('/api/settings/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token || ''}`
        },
        body: JSON.stringify({ api_health_interval_ms: i, api_health_ok_ms: o })
      })

      if (res.ok) {
        localStorage.setItem('prefs:api_health_interval_ms', String(i))
        localStorage.setItem('prefs:api_health_ok_ms', String(o))
        toast('Preferências salvas', 'success')
      } else {
        const err = await res.json().catch(() => ({}))
        toast(err?.error?.message || 'Erro ao salvar preferências', 'error')
      }
    } catch (e:any) {
      toast(e?.message || 'Erro ao salvar preferências', 'error')
    } finally {
      setLoading(false)
    }
  }

  const saveCompany = async () => {
    try {
      setLoading(true)
      const i = parseInt(cIntervalMs, 10)
      const o = parseInt(cOkBadgeMs, 10)
      if (!Number.isFinite(i) || i <= 0) throw new Error('Intervalo inválido (empresa)')
      if (!Number.isFinite(o) || o < 0) throw new Error('Duração inválida (empresa)')

      const res = await fetch('/api/settings/preferences/company', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token || ''}`
        },
        body: JSON.stringify({ api_health_interval_ms: i, api_health_ok_ms: o })
      })

      if (res.ok) {
        toast('Preferências da empresa salvas', 'success')
      } else {
        const err = await res.json().catch(() => ({}))
        toast(err?.error?.message || 'Erro ao salvar preferências da empresa', 'error')
      }
    } catch (e:any) {
      toast(e?.message || 'Erro ao salvar preferências da empresa', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-900">Saúde da API (Usuário)</h4>
          <p className="text-sm text-gray-500">Configurar intervalo de checagem e duração da badge de sucesso</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Intervalo de checagem (ms)</label>
            <input type="number" min={1000} className="w-full px-3 py-2 border rounded" value={intervalMs} onChange={e=>setIntervalMs(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duração da badge \"API OK\" (ms)</label>
            <input type="number" min={0} className="w-full px-3 py-2 border rounded" value={okBadgeMs} onChange={e=>setOkBadgeMs(e.target.value)} />
          </div>
        </div>
        <div className="flex justify-end">
          <button disabled={loading} onClick={save} className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">Salvar (Usuário)</button>
        </div>
      </div>

      {isAdmin && (
        <div className="space-y-4 border-t pt-6">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Saúde da API (Empresa)</h4>
            <p className="text-sm text-gray-500">Define o padrão para todos os usuários da sua empresa. Usuários ainda podem substituir localmente.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Intervalo de checagem (ms)</label>
              <input type="number" min={1000} className="w-full px-3 py-2 border rounded" value={cIntervalMs} onChange={e=>setCIntervalMs(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duração da badge \"API OK\" (ms)</label>
              <input type="number" min={0} className="w-full px-3 py-2 border rounded" value={cOkBadgeMs} onChange={e=>setCOkBadgeMs(e.target.value)} />
            </div>
          </div>
          <div className="flex justify-end">
            <button disabled={loading} onClick={saveCompany} className="px-4 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50">Salvar (Empresa)</button>
          </div>
        </div>
      )}
    </div>
  )
}

