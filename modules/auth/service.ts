import { supabase } from './supabase'
import crypto from 'crypto'
import { sendEmail } from '../notifications/email'

interface RegisterData {
  email: string
  password: string
  name: string
  phone?: string
  role: string
  company_name?: string
}

interface AcceptInviteData {
  password: string
  name: string
  phone?: string
  company_name?: string
}

export class AuthService {
  async login(email: string, password: string) {
    // Fazer login no Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw new Error(error.message)
    }

    // Atualizar último login
    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', data.user.id)

    // Buscar dados completos do usuário
    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single()

    return {
      user: { ...data.user, ...userData },
      session: data.session
    }
  }

  async register(userData: RegisterData) {
    // Verificar se email já existe
    const { data: existingUser } = await supabase
      .from('users')
      .select('email')
      .eq('email', userData.email)
      .single()

    if (existingUser) {
      throw new Error('Email já está em uso')
    }

    // Criar usuário no Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          name: userData.name,
        },
      },
    })

    if (error) {
      throw new Error(error.message)
    }

    if (data.user) {
      // Criar registro na tabela users
      const { error: userError } = await supabase
        .from('users')
        .insert([{
          id: data.user.id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          role: userData.role,
          company_name: userData.company_name,
          email_verified: false
        }])

      if (userError) {
        // Se falhar, deletar usuário do auth
        await supabase.auth.admin.deleteUser(data.user.id)
        throw new Error('Erro ao criar perfil do usuário')
      }

      // Enviar email de confirmação (se configurado)
      try {
        await this.sendVerificationEmail(userData.email, userData.name)
      } catch (emailError) {
        console.error('Erro ao enviar email de verificação:', emailError)
      }
    }

    return {
      user: data.user,
      session: data.session,
      message: 'Usuário criado com sucesso. Verifique seu email para ativar a conta.'
    }
  }

  async requestPasswordReset(email: string) {
    // Verificar se usuário existe
    const { data: user } = await supabase
      .from('users')
      .select('id, name')
      .eq('email', email)
      .single()

    if (!user) {
      // Por segurança, não revelar se o email existe ou não
      return { message: 'Se o email existir, você receberá instruções para redefinir sua senha.' }
    }

    // Gerar token único
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hora

    // Salvar token no banco
    const { error } = await supabase
      .from('password_reset_tokens')
      .insert([{
        user_id: user.id,
        email: email,
        token: token,
        expires_at: expiresAt.toISOString()
      }])

    if (error) {
      throw new Error('Erro ao gerar token de recuperação')
    }

    // Enviar email com link de recuperação
    try {
      await this.sendPasswordResetEmail(email, user.name, token)
    } catch (emailError) {
      console.error('Erro ao enviar email de recuperação:', emailError)
      throw new Error('Erro ao enviar email de recuperação')
    }

    return { message: 'Se o email existir, você receberá instruções para redefinir sua senha.' }
  }

  async resetPassword(token: string, newPassword: string) {
    // Buscar token válido
    const { data: resetToken, error } = await supabase
      .from('password_reset_tokens')
      .select('*')
      .eq('token', token)
      .is('used_at', null)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (error || !resetToken) {
      throw new Error('Token inválido ou expirado')
    }

    // Atualizar senha no Supabase Auth
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      resetToken.user_id,
      { password: newPassword }
    )

    if (updateError) {
      throw new Error('Erro ao atualizar senha')
    }

    // Marcar token como usado
    await supabase
      .from('password_reset_tokens')
      .update({ used_at: new Date().toISOString() })
      .eq('id', resetToken.id)

    return { message: 'Senha redefinida com sucesso' }
  }

  async inviteUser(email: string, role: string, invitedBy: string) {
    // Verificar se email já existe
    const { data: existingUser } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single()

    if (existingUser) {
      throw new Error('Email já está em uso')
    }

    // Verificar se já existe convite pendente
    const { data: existingInvite } = await supabase
      .from('user_invites')
      .select('*')
      .eq('email', email)
      .is('accepted_at', null)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (existingInvite) {
      throw new Error('Já existe um convite pendente para este email')
    }

    // Gerar token único
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 dias

    // Salvar convite
    const { error } = await supabase
      .from('user_invites')
      .insert([{
        email: email,
        role: role,
        invited_by: invitedBy,
        token: token,
        expires_at: expiresAt.toISOString()
      }])

    if (error) {
      throw new Error('Erro ao criar convite')
    }

    // Enviar email de convite
    try {
      await this.sendInviteEmail(email, role, token)
    } catch (emailError) {
      console.error('Erro ao enviar email de convite:', emailError)
      throw new Error('Erro ao enviar email de convite')
    }

    return { message: 'Convite enviado com sucesso' }
  }

  async acceptInvite(token: string, userData: AcceptInviteData) {
    // Buscar convite válido
    const { data: invite, error } = await supabase
      .from('user_invites')
      .select('*')
      .eq('token', token)
      .is('accepted_at', null)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (error || !invite) {
      throw new Error('Convite inválido ou expirado')
    }

    // Criar usuário
    const registerData: RegisterData = {
      email: invite.email,
      password: userData.password,
      name: userData.name,
      phone: userData.phone,
      role: invite.role,
      company_name: userData.company_name
    }

    const result = await this.register(registerData)

    // Marcar convite como aceito
    await supabase
      .from('user_invites')
      .update({ accepted_at: new Date().toISOString() })
      .eq('id', invite.id)

    return {
      ...result,
      message: 'Convite aceito e conta criada com sucesso'
    }
  }

  async listUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, phone, role, company_name, is_active, email_verified, last_login, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error('Erro ao buscar usuários')
    }

    return data
  }

  async updateUser(id: string, updateData: any) {
    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error('Erro ao atualizar usuário')
    }

    return { user: data }
  }

  async deactivateUser(id: string) {
    const { error } = await supabase
      .from('users')
      .update({ is_active: false })
      .eq('id', id)

    if (error) {
      throw new Error('Erro ao desativar usuário')
    }

    return { message: 'Usuário desativado com sucesso' }
  }

  private async sendVerificationEmail(email: string, name: string) {
    // Implementar envio de email de verificação
    // Por enquanto apenas log
    console.log(`Enviando email de verificação para ${email}`)
  }

  private async sendPasswordResetEmail(email: string, name: string, token: string) {
    // Implementar envio de email de recuperação
    // Por enquanto apenas log
    console.log(`Enviando email de recuperação para ${email} com token ${token}`)
  }

  private async sendInviteEmail(email: string, role: string, token: string) {
    // Implementar envio de email de convite
    // Por enquanto apenas log
    console.log(`Enviando convite para ${email} com role ${role} e token ${token}`)
  }
}
