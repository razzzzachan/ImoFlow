import { supabase } from '../auth/supabase'

interface LeadData {
  name: string
  email?: string
  phone?: string
  whatsapp?: string
  property_type?: string
  location?: string
  budget_min?: number
  budget_max?: number
  source?: string
  assigned_to?: string
  tags?: string[]
  notes?: string
  priority?: 'low' | 'medium' | 'high'
}

interface UpdateLeadData extends Partial<LeadData> {
  status?: string
  lead_score?: number
  next_followup?: string
}

export class CRMService {
  async createLead(leadData: LeadData, createdBy: string) {
    const { data: lead, error } = await supabase
      .from('leads')
      .insert([{
        ...leadData,
        status: 'captado',
        lead_score: this.calculateInitialScore(leadData),
        last_contact: new Date().toISOString()
      }])
      .select(`
        *,
        assigned_user:users!assigned_to(name, email, avatar_url)
      `)
      .single()

    if (error) {
      throw new Error('Erro ao criar lead')
    }

    // Registrar interação inicial
    await this.addInteraction(lead.id, createdBy, 'note', 'Lead criado no sistema', {
      source: leadData.source || 'manual'
    })

    return lead
  }

  async updateLead(leadId: string, updateData: UpdateLeadData, updatedBy: string) {
    // Buscar lead atual para comparar status
    const { data: currentLead } = await supabase
      .from('leads')
      .select('status')
      .eq('id', leadId)
      .single()

    const { data: lead, error } = await supabase
      .from('leads')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', leadId)
      .select(`
        *,
        assigned_user:users!assigned_to(name, email, avatar_url)
      `)
      .single()

    if (error) {
      throw new Error('Erro ao atualizar lead')
    }

    // Se o status mudou, registrar no histórico
    if (updateData.status && currentLead && currentLead.status !== updateData.status) {
      await this.recordStatusChange(leadId, currentLead.status, updateData.status, updatedBy)
    }

    return lead
  }

  async getLeads(filters: {
    status?: string
    assigned_to?: string
    source?: string
    property_type?: string
    page?: number
    limit?: number
  }) {
    let query = supabase
      .from('leads')
      .select(`
        *,
        assigned_user:users!assigned_to(name, email, avatar_url),
        interactions(count)
      `)

    // Aplicar filtros
    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    if (filters.assigned_to) {
      query = query.eq('assigned_to', filters.assigned_to)
    }
    if (filters.source) {
      query = query.eq('source', filters.source)
    }
    if (filters.property_type) {
      query = query.eq('property_type', filters.property_type)
    }

    // Paginação
    const page = filters.page || 1
    const limit = filters.limit || 20
    const from = (page - 1) * limit
    const to = from + limit - 1

    query = query.range(from, to).order('created_at', { ascending: false })

    const { data: leads, error, count } = await query

    if (error) {
      throw new Error('Erro ao buscar leads')
    }

    return {
      leads,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    }
  }

  async getLeadById(leadId: string) {
    const { data: lead, error } = await supabase
      .from('leads')
      .select(`
        *,
        assigned_user:users!assigned_to(name, email, avatar_url),
        interactions(
          *,
          user:users(name, avatar_url)
        ),
        tasks(
          *,
          assigned_user:users!assigned_to(name, email)
        ),
        status_history:lead_status_history(
          *,
          changed_by_user:users!changed_by(name, email)
        )
      `)
      .eq('id', leadId)
      .single()

    if (error) {
      throw new Error('Lead não encontrado')
    }

    return lead
  }

  async addInteraction(leadId: string, userId: string, type: string, content: string, metadata?: any) {
    const { data: interaction, error } = await supabase
      .from('interactions')
      .insert([{
        lead_id: leadId,
        user_id: userId,
        type,
        content,
        metadata: metadata || {}
      }])
      .select(`
        *,
        user:users(name, avatar_url)
      `)
      .single()

    if (error) {
      throw new Error('Erro ao adicionar interação')
    }

    // Atualizar último contato do lead
    await supabase
      .from('leads')
      .update({ last_contact: new Date().toISOString() })
      .eq('id', leadId)

    return interaction
  }

  async recordStatusChange(leadId: string, fromStatus: string, toStatus: string, changedBy: string, reason?: string) {
    // Registrar no histórico
    await supabase
      .from('lead_status_history')
      .insert([{
        lead_id: leadId,
        from_status: fromStatus,
        to_status: toStatus,
        changed_by: changedBy,
        reason
      }])

    // Registrar como interação
    await this.addInteraction(
      leadId,
      changedBy,
      'status_change',
      `Status alterado de "${fromStatus}" para "${toStatus}"${reason ? `. Motivo: ${reason}` : ''}`,
      { from_status: fromStatus, to_status: toStatus, reason }
    )
  }

  async getLeadsByStatus() {
    const { data: leads, error } = await supabase
      .from('leads')
      .select('status')

    if (error) {
      throw new Error('Erro ao buscar leads por status')
    }

    const statusCount: Record<string, number> = {}
    leads?.forEach(lead => {
      statusCount[lead.status] = (statusCount[lead.status] || 0) + 1
    })

    return statusCount
  }

  async getStats() {
    // Total de leads
    const { count: totalLeads } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })

    // Leads por status
    const leadsByStatus = await this.getLeadsByStatus()

    // Tarefas pendentes
    const { count: pendingTasks } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('completed', false)

    // Interações hoje
    const today = new Date().toISOString().split('T')[0]
    const { count: interactionsToday } = await supabase
      .from('interactions')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today)

    return {
      leads: {
        total: totalLeads || 0,
        byStatus: leadsByStatus
      },
      tasks: {
        pending: pendingTasks || 0
      },
      interactions: {
        today: interactionsToday || 0
      }
    }
  }

  async getFunnelData() {
    // Buscar configuração do funil (por enquanto usar padrão)
    const defaultStages = [
      { id: 'captado', name: 'Captado', color: '#6B7280' },
      { id: 'em_atendimento', name: 'Em Atendimento', color: '#3B82F6' },
      { id: 'visita_marcada', name: 'Visita Marcada', color: '#F59E0B' },
      { id: 'proposta', name: 'Proposta', color: '#8B5CF6' },
      { id: 'negociacao', name: 'Negociação', color: '#EF4444' },
      { id: 'fechado', name: 'Fechado', color: '#10B981' },
      { id: 'perdido', name: 'Perdido', color: '#6B7280' }
    ]

    const leadsByStatus = await this.getLeadsByStatus()

    return defaultStages.map(stage => ({
      ...stage,
      count: leadsByStatus[stage.id] || 0
    }))
  }

  async assignLead(leadId: string, assignedTo: string, assignedBy: string) {
    const { data: lead, error } = await supabase
      .from('leads')
      .update({ assigned_to: assignedTo })
      .eq('id', leadId)
      .select(`
        *,
        assigned_user:users!assigned_to(name, email)
      `)
      .single()

    if (error) {
      throw new Error('Erro ao atribuir lead')
    }

    // Registrar interação
    await this.addInteraction(
      leadId,
      assignedBy,
      'note',
      `Lead atribuído para ${lead.assigned_user?.name}`,
      { assigned_to: assignedTo }
    )

    return lead
  }

  async bulkUpdateStatus(leadIds: string[], newStatus: string, updatedBy: string, reason?: string) {
    const results = []

    for (const leadId of leadIds) {
      try {
        const result = await this.updateLead(leadId, { status: newStatus }, updatedBy)
        results.push({ leadId, success: true, lead: result })
      } catch (error) {
        results.push({ leadId, success: false, error: error.message })
      }
    }

    return results
  }

  private calculateInitialScore(leadData: LeadData): number {
    let score = 50 // Score base

    // Pontuação por informações fornecidas
    if (leadData.email) score += 10
    if (leadData.phone) score += 10
    if (leadData.whatsapp) score += 15
    if (leadData.budget_min && leadData.budget_max) score += 20
    if (leadData.location) score += 10
    if (leadData.property_type) score += 10

    // Pontuação por fonte
    switch (leadData.source) {
      case 'indicacao':
        score += 25
        break
      case 'site':
        score += 15
        break
      case 'whatsapp':
      case 'bot':
        score += 10
        break
    }

    return Math.min(score, 100) // Máximo 100
  }
}
