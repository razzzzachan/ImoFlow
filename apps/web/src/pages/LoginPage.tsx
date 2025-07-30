import { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

type AuthMode = 'login' | 'register' | 'forgot-password' | 'accept-invite'

export function LoginPage() {
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const { user, signIn, signUp } = useAuth()

  if (user) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      let result

      if (mode === 'login') {
        result = await signIn(email, password)
        if (result.error) {
          setError(result.error)
        }
      } else if (mode === 'register') {
        result = await signUp(email, password, name, phone, companyName)
        if (result.error) {
          setError(result.error)
        } else {
          setSuccess('Conta criada com sucesso! Verifique seu email.')
        }
      } else if (mode === 'forgot-password') {
        // Implementar recuperação de senha
        const response = await fetch('/api/auth/recover-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        })

        const data = await response.json()
        if (response.ok) {
          setSuccess(data.message)
        } else {
          setError(data.error)
        }
      }
    } catch (err) {
      setError('Erro inesperado. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const getTitle = () => {
    switch (mode) {
      case 'login': return 'Entre na sua conta'
      case 'register': return 'Crie sua conta'
      case 'forgot-password': return 'Recuperar senha'
      case 'accept-invite': return 'Aceitar convite'
      default: return 'ImmoFlow'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {getTitle()}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            ImmoFlow - CRM Imobiliário com IA
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            {(mode === 'register' || mode === 'accept-invite') && (
              <div>
                <label htmlFor="name" className="sr-only">
                  Nome
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            {(mode === 'register' || mode === 'accept-invite') && (
              <div>
                <label htmlFor="phone" className="sr-only">
                  Telefone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Telefone (opcional)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            )}

            {(mode === 'register' || mode === 'accept-invite') && (
              <div>
                <label htmlFor="company" className="sr-only">
                  Empresa
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Nome da empresa (opcional)"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 ${
                  mode === 'login' ? 'rounded-t-md' : ''
                } focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Endereço de email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {mode !== 'forgot-password' && (
              <div>
                <label htmlFor="password" className="sr-only">
                  Senha
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder={mode === 'login' ? 'Senha' : 'Nova senha'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            )}
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md">{error}</div>
          )}

          {success && (
            <div className="text-green-600 text-sm text-center bg-green-50 p-3 rounded-md">{success}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                mode === 'login' ? 'Entrar' :
                mode === 'register' ? 'Criar conta' :
                mode === 'forgot-password' ? 'Enviar link' :
                'Aceitar convite'
              )}
            </button>
          </div>

          <div className="text-center space-y-2">
            {mode === 'login' && (
              <>
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-500 text-sm block w-full"
                  onClick={() => {
                    setMode('register')
                    setError('')
                    setSuccess('')
                  }}
                >
                  Não tem uma conta? Cadastre-se
                </button>
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-500 text-sm block w-full"
                  onClick={() => {
                    setMode('forgot-password')
                    setError('')
                    setSuccess('')
                  }}
                >
                  Esqueceu sua senha?
                </button>
              </>
            )}

            {mode === 'register' && (
              <button
                type="button"
                className="text-blue-600 hover:text-blue-500 text-sm"
                onClick={() => {
                  setMode('login')
                  setError('')
                  setSuccess('')
                }}
              >
                Já tem uma conta? Entre
              </button>
            )}

            {mode === 'forgot-password' && (
              <button
                type="button"
                className="text-blue-600 hover:text-blue-500 text-sm"
                onClick={() => {
                  setMode('login')
                  setError('')
                  setSuccess('')
                }}
              >
                Voltar ao login
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
