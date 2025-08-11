export interface AuthUser {
  id: string
  name: string
  email: string
  role: string
}

export async function getUsers(token: string): Promise<AuthUser[]> {
  const res = await fetch('/api/auth/users', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  if (!res.ok) throw new Error('Falha ao buscar usuários')
  const json = await res.json()
  return json.users as AuthUser[]
}

