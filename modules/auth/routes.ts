import { FastifyInstance } from 'fastify'
import { supabase } from './supabase'
import { AuthService } from './service'

const authService = new AuthService()

export default async function authRoutes(fastify: FastifyInstance) {

  // Rota de login
  fastify.post('/login', async (request, reply) => {
    const { email, password } = request.body as { email: string; password: string }

    try {
      const result = await authService.login(email, password)
      return result
    } catch (error: any) {
      return reply.status(400).send({ error: error.message })
    }
  })

  // Rota de registro
  fastify.post('/register', async (request, reply) => {
    const { email, password, name, phone, role, company_name } = request.body as {
      email: string;
      password: string;
      name: string;
      phone?: string;
      role?: string;
      company_name?: string;
    }

    try {
      const result = await authService.register({
        email,
        password,
        name,
        phone,
        role: role || 'corretor',
        company_name
      })
      return result
    } catch (error: any) {
      return reply.status(400).send({ error: error.message })
    }
  })

  // Rota de logout
  fastify.post('/logout', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const token = request.headers.authorization?.replace('Bearer ', '')
    
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      return reply.status(400).send({ error: error.message })
    }

    return { message: 'Logout realizado com sucesso' }
  })

  // Rota para obter perfil do usuário
  fastify.get('/profile', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    return { user: (request as any).user }
  })

  // Rota de recuperação de senha
  fastify.post('/recover-password', async (request, reply) => {
    const { email } = request.body as { email: string }

    try {
      const result = await authService.requestPasswordReset(email)
      return result
    } catch (error: any) {
      return reply.status(400).send({ error: error.message })
    }
  })

  // Rota para resetar senha
  fastify.post('/reset-password', async (request, reply) => {
    const { token, password } = request.body as { token: string; password: string }

    try {
      const result = await authService.resetPassword(token, password)
      return result
    } catch (error: any) {
      return reply.status(400).send({ error: error.message })
    }
  })

  // Rota para convidar usuário (apenas admin/gestor)
  fastify.post('/invite', {
    preHandler: [fastify.authenticate, fastify.requireRole(['admin', 'gestor'])]
  }, async (request, reply) => {
    const { email, role } = request.body as { email: string; role: string }
    const invitedBy = (request as any).user.id

    try {
      const result = await authService.inviteUser(email, role, invitedBy)
      return result
    } catch (error: any) {
      return reply.status(400).send({ error: error.message })
    }
  })

  // Rota para aceitar convite
  fastify.post('/accept-invite', async (request, reply) => {
    const { token, password, name, phone, company_name } = request.body as {
      token: string;
      password: string;
      name: string;
      phone?: string;
      company_name?: string;
    }

    try {
      const result = await authService.acceptInvite(token, {
        password,
        name,
        phone,
        company_name
      })
      return result
    } catch (error: any) {
      return reply.status(400).send({ error: error.message })
    }
  })

  // Rota para listar usuários (apenas admin/gestor)
  fastify.get('/users', {
    preHandler: [fastify.authenticate, fastify.requireRole(['admin', 'gestor'])]
  }, async (request, reply) => {
    try {
      const users = await authService.listUsers()
      return { users }
    } catch (error: any) {
      return reply.status(400).send({ error: error.message })
    }
  })

  // Rota para atualizar usuário
  fastify.put('/users/:id', {
    preHandler: [fastify.authenticate]
  }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const currentUser = (request as any).user
    const updateData = request.body as any

    // Verificar se é o próprio usuário ou admin/gestor
    if (currentUser.id !== id && !['admin', 'gestor'].includes(currentUser.role)) {
      return reply.status(403).send({ error: 'Acesso negado' })
    }

    try {
      const result = await authService.updateUser(id, updateData)
      return result
    } catch (error: any) {
      return reply.status(400).send({ error: error.message })
    }
  })

  // Rota para desativar usuário (apenas admin/gestor)
  fastify.patch('/users/:id/deactivate', {
    preHandler: [fastify.authenticate, fastify.requireRole(['admin', 'gestor'])]
  }, async (request, reply) => {
    const { id } = request.params as { id: string }

    try {
      const result = await authService.deactivateUser(id)
      return result
    } catch (error: any) {
      return reply.status(400).send({ error: error.message })
    }
  })
}
