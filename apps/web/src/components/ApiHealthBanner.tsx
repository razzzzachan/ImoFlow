import { useEffect, useState } from 'react'
import { usePreferences } from '../contexts/PreferencesContext'

export function ApiHealthBanner() {
  const [healthy, setHealthy] = useState<boolean | null>(null)
  const [dismissed, setDismissed] = useState<boolean>(() => {
    return typeof window !== 'undefined' && sessionStorage.getItem('apiHealthBanner:dismissed') === '1'
  })

  const { preferences } = usePreferences()
  const pollEvery = preferences?.api_health_interval_ms ?? 30000

  const [showOk, setShowOk] = useState(false)
  const okBadgeMs = preferences?.api_health_ok_ms ?? 3000
  useEffect(() => {
    if (healthy === true) {
      setShowOk(true)
      const t = setTimeout(() => setShowOk(false), okBadgeMs)
      return () => clearTimeout(t)
    }
  }, [healthy, okBadgeMs])

  useEffect(() => {
    let active = true
    const check = async () => {
      try {
        const res = await fetch('/api/health')
        if (!active) return
        setHealthy(res.ok)
      } catch {
        if (!active) return
        setHealthy(false)
      }
    }
    check()
    const id = setInterval(check, pollEvery)
    return () => { active = false; clearInterval(id) }
  }, [pollEvery])

  if (dismissed) return null

  if (healthy === true && showOk) {
    return (
      <div className="w-full bg-green-100 border-b border-green-300 text-green-800 text-xs py-1 px-4 text-center">
        API OK
      </div>
    )
  }

  if (healthy !== false) return null

  return (
    <div className="w-full bg-yellow-100 border-b border-yellow-300 text-yellow-800 text-sm py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="text-center w-full">
          API offline ou instável. Algumas funcionalidades podem não estar disponíveis.
        </div>
        <button
          aria-label="Fechar aviso"
          onClick={() => { sessionStorage.setItem('apiHealthBanner:dismissed', '1'); setDismissed(true) }}
          className="ml-4 text-xs px-2 py-1 border border-yellow-400 rounded hover:bg-yellow-200"
        >
          Fechar
        </button>
      </div>
    </div>
  )
}

