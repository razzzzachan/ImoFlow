import { supabase } from '../../../auth/supabase'
import {
  CreateLeadData,
  Lead,
  LeadFilters,
  UpdateLeadData
} from '../../domain/entities/Lead'
import { leadsCreatedCounter, statusChangesCounter, assignmentsCounter, errorsCounter } from '../metrics'

export class CRMRepository {
  private calculateInitialScore(leadData: CreateLeadData): number {
    let score = 50
    if (leadData.email) score += 10
    if (leadData.phone) score += 10
    if (leadData.whatsapp) score += 15
    if (leadData.budget_min && leadData.budget_max) score += 20
    if (leadData.location) score += 10
    if (leadData.property_type) score += 10

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

    return Math.min(score, 100)
  }

  async createLead(leadData: CreateLeadData, createdBy: string): Promise<Lead> {
    // métricas
    try { (require('../../../apps/api/src/plugins/metrics-crm') as any) } catch {}

    const { data: lead, error } = await supabase
      .from('leads')
      .insert([
        {
          ...leadData,
          status: 'captado',
          lead_score: this.calculateInitialScore(leadData),
          last_contact: new Date().toISOString()
        }
      ])
      .select(
        `*,
         assigned_user:users!assigned_to(name, email, avatar_url)`
      )
      .single()

    if (error) {
      errorsCounter.inc()
      throw new Error('Erro ao criar lead')
    }

    // Interação inicial
    await supabase
      .from('interactions')
      .insert([
        {
          lead_id: (lead as any).id,
          user_id: createdBy,
          type: 'note',
          content: 'Lead criado no sistema',
          metadata: { source: leadData.source || 'manual' }
        }
      ])

    // métrica
    leadsCreatedCounter.inc()

    return lead as Lead
  }

  async getLeads(filters: LeadFilters): Promise<{ leads: Lead[]; pagination: any }> {
    let query = supabase
      .from('leads')
      .select(
        `*,
         assigned_user:users!assigned_to(name, email, avatar_url),
         interactions(count)`
      )

    if (filters.status) query = query.eq('status', filters.status)
    if (filters.assigned_to) query = query.eq('assigned_to', filters.assigned_to)
    if (filters.source) query = query.eq('source', filters.source)
    if (filters.property_type) query = query.eq('property_type', filters.property_type)

    const page = filters.page || 1
    const limit = filters.limit || 20
    const from = (page - 1) * limit
    const to = from + limit - 1

    query = query.range(from, to).order('created_at', { ascending: false })

    const { data: leads, error, count } = await query

    if (error) {
      errorsCounter.inc()
      throw new Error('Erro ao buscar leads')
    }

    return {
      leads: (leads || []) as unknown as Lead[],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    }
  }

  async getLeadById(leadId: string): Promise<Lead> {
    const { data: lead, error } = await supabase
      .from('leads')
      .select(`
        *,
        assigned_user:users!assigned_to(name, email, avatar_url),
        interactions(*, user:users(name, avatar_url)),
        tasks(*, assigned_user:users!assigned_to(name, email)),
        status_history:lead_status_history(*, changed_by_user:users!changed_by(name, email))
      `)
      .eq('id', leadId)
      .single()

    if (error) {
      errorsCounter.inc()
      throw new Error('Lead não encontrado')
    }

    return lead as Lead
  }

  async updateLead(leadId: string, updateData: UpdateLeadData, updatedBy: string): Promise<Lead> {
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
      errorsCounter.inc()
      throw new Error('Erro ao atualizar lead')
    }

    if (updateData.status && currentLead && (currentLead as any).status !== updateData.status) {
      await this.recordStatusChange(leadId, (currentLead as any).status, updateData.status, updatedBy)
      statusChangesCounter.inc({ status_to: updateData.status })
    }

    return lead as Lead
  }

  private async recordStatusChange(leadId: string, fromStatus: string, toStatus: string, changedBy: string, reason?: string) {
    await supabase
      .from('lead_status_history')
      .insert([
        { lead_id: leadId, from_status: fromStatus, to_status: toStatus, changed_by: changedBy, reason }
      ])

    await supabase
      .from('interactions')
      .insert([
        {
          lead_id: leadId,
          user_id: changedBy,
          type: 'status_change',
          content: `Status alterado de "${fromStatus}" para "${toStatus}"${reason ? `. Motivo: ${reason}` : ''}`,
          metadata: { from_status: fromStatus, to_status: toStatus, reason }
        }
      ])
  }

  async assignLead(leadId: string, assignedTo: string, assignedBy: string): Promise<Lead> {
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
      errorsCounter.inc()
      throw new Error('Erro ao atribuir lead')
    }

    await supabase
      .from('interactions')
      .insert([
        {
          lead_id: leadId,
          user_id: assignedBy,
          type: 'note',
          content: `Lead atribuído para ${(lead as any).assigned_user?.name}`,
          metadata: { assigned_to: assignedTo }
        }
      ])

    assignmentsCounter.inc()

    return lead as Lead
  }

  async bulkUpdateStatus(leadIds: string[], newStatus: string, updatedBy: string, reason?: string) {
    const results: any[] = []

    for (const leadId of leadIds) {
      try {
        const result = await this.updateLead(leadId, { status: newStatus }, updatedBy)
        results.push({ leadId, success: true, lead: result })
      } catch (error: any) {
        results.push({ leadId, success: false, error: error.message })
      }
    }

    return results
  }
}

