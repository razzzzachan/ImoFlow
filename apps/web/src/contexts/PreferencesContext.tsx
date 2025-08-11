import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext'

type Preferences = {
  api_health_interval_ms: number
  api_health_ok_ms: number
}

type PreferencesContextValue = {
  preferences: Preferences | null
  loading: boolean
  refresh: () => Promise<void>
}

const PreferencesContext = createContext<PreferencesContextValue | undefined>(undefined)

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const { session } = useAuth()
  const [preferences, setPreferences] = useState<Preferences | null>(null)
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/settings/preferences', {
        headers: { Authorization: `Bearer ${session?.access_token || ''}` }
      })
      if (res.ok) {
        const { data } = await res.json()
        const prefs = data?.preferences || {}
        const effective: Preferences = {
          api_health_interval_ms: Number(prefs.api_health_interval_ms ?? localStorage.getItem('prefs:api_health_interval_ms') ?? 30000),
          api_health_ok_ms: Number(prefs.api_health_ok_ms ?? localStorage.getItem('prefs:api_health_ok_ms') ?? 3000)
        }
        setPreferences(effective)
      } else {
        const effective: Preferences = {
          api_health_interval_ms: Number(localStorage.getItem('prefs:api_health_interval_ms') ?? 30000),
          api_health_ok_ms: Number(localStorage.getItem('prefs:api_health_ok_ms') ?? 3000)
        }
        setPreferences(effective)
      }
    } catch {
      const effective: Preferences = {
        api_health_interval_ms: Number(localStorage.getItem('prefs:api_health_interval_ms') ?? 30000),
        api_health_ok_ms: Number(localStorage.getItem('prefs:api_health_ok_ms') ?? 3000)
      }
      setPreferences(effective)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.access_token])

  const value = useMemo(() => ({ preferences, loading, refresh: load }), [preferences, loading])

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  )
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext)
  if (!ctx) throw new Error('usePreferences must be used within PreferencesProvider')
  return ctx
}

