import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Plus, Mail, Phone, Shield, ShieldCheck, ShieldX, UserX } from 'lucide-react'
import { useToast } from '../contexts/ToastContext'
import { Loading } from '../components/Loading'

interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: string
  company_name?: string
  is_active: boolean
  email_verified: boolean
  last_login?: string
  created_at: string
}

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('corretor')
  const [inviteLoading, setInviteLoading] = useState(false)


  const { user: currentUser, session } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/auth/users', {
        headers: {
          'Authorization': `Bearer ${session?.access_token || ''}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setInviteLoading(true)

    try {
      const response = await fetch('/api/auth/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || ''}`
        },
        body: JSON.stringify({
          email: inviteEmail,
          role: inviteRole
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast('Convite enviado', 'success')
        setInviteEmail('')
        setShowInviteModal(false)
      } else {
        toast(data?.error || 'Erro ao enviar convite', 'error')
      }
    } catch (err) {
      toast('Erro ao enviar convite', 'error')
    } finally {
      setInviteLoading(false)
    }
  }

  const handleDeactivateUser = async (userId: string) => {
    if (!confirm('Tem certeza que deseja desativar este usuário?')) {
      return
    }

    try {
      const response = await fetch(`/api/auth/users/${userId}/deactivate`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${session?.access_token || ''}`
        }
      })

      if (response.ok) {
        toast('Usuário desativado com sucesso', 'success')
        fetchUsers()
      } else {
        const data = await response.json()
        toast(data?.error || 'Erro ao desativar usuário', 'error')
      }
    } catch (err) {
      toast('Erro ao desativar usuário', 'error')
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <ShieldCheck className="h-4 w-4 text-red-500" />
      case 'gestor': return <Shield className="h-4 w-4 text-blue-500" />
      case 'corretor': return <ShieldX className="h-4 w-4 text-green-500" />
      case 'atendente': return <ShieldX className="h-4 w-4 text-gray-500" />
      default: return <ShieldX className="h-4 w-4 text-gray-500" />
    }
  }

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: 'Administrador',
      gestor: 'Gestor',
      corretor: 'Corretor',
      atendente: 'Atendente'
    }
    return labels[role] || role
  }

  if (!currentUser || !['admin', 'gestor'].includes(currentUser.role || '')) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Acesso Negado</h2>
        <p className="text-gray-600">Você não tem permissão para acessar esta página.</p>
      </div>
    )
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Usuários</h1>
          <p className="text-gray-600">Gerencie usuários e convites</p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Convidar Usuário
        </button>
      </div>

      <div className="flex justify-end">
        <button onClick={fetchUsers} disabled={loading} className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50 disabled:opacity-50">
          Recarregar
        </button>
      </div>



      {/* Lista de usuários */}
      {users.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-md border border-gray-200">
          <h3 className="text-sm font-medium text-gray-900">Nenhum usuário encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">Convide alguém para começar.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {users.map((user) => (
            <li key={user.id}>
              <div className="px-4 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      {!user.is_active && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Inativo
                        </span>
                      )}
                    </div>
                    <div className="flex items-center mt-1">
                      <Mail className="h-3 w-3 text-gray-400 mr-1" />
                      <p className="text-sm text-gray-500">{user.email}</p>
                      {user.phone && (
                        <>
                          <Phone className="h-3 w-3 text-gray-400 ml-3 mr-1" />
                          <p className="text-sm text-gray-500">{user.phone}</p>
                        </>
                      )}
                    </div>
                    <div className="flex items-center mt-1">
                      {getRoleIcon(user.role)}
                      <span className="ml-1 text-sm text-gray-500">{getRoleLabel(user.role)}</span>
                      {user.company_name && (
                        <span className="ml-3 text-sm text-gray-500">• {user.company_name}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {user.is_active && user.id !== currentUser.id && (
                    <button
                      onClick={() => handleDeactivateUser(user.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Desativar usuário"
                    >
                      <UserX className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      )}


      {/* Modal de convite */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Convidar Usuário</h3>

              <form onSubmit={handleInviteUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="email@exemplo.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Função
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                  >
                    <option value="corretor">Corretor</option>
                    <option value="atendente">Atendente</option>
                    {currentUser.role === 'admin' && (
                      <>
                        <option value="gestor">Gestor</option>
                        <option value="admin">Administrador</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={inviteLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
                  >
                    {inviteLoading ? 'Enviando...' : 'Enviar Convite'}
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
