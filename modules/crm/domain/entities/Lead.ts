export interface Lead {
  id: string
  name: string
  email?: string
  phone?: string
  whatsapp?: string
  property_type?: string
  location?: string
  budget_min?: number
  budget_max?: number
  source?: string
  status: LeadStatus
  lead_score: number
  priority: LeadPriority
  assigned_to?: string
  tags?: string[]
  notes?: string
  next_followup?: string
  last_contact?: string
  created_at: string
  updated_at: string
}

export type LeadStatus = 
  | 'captado'
  | 'em_atendimento' 
  | 'visita_marcada'
  | 'proposta'
  | 'negociacao'
  | 'fechado'
  | 'perdido'

export type LeadPriority = 'low' | 'medium' | 'high'

export interface CreateLeadData {
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
  priority?: LeadPriority
}

export interface UpdateLeadData extends Partial<CreateLeadData> {
  status?: LeadStatus
  lead_score?: number
  next_followup?: string
}

export interface LeadFilters {
  status?: LeadStatus
  assigned_to?: string
  source?: string
  property_type?: string
  page?: number
  limit?: number
}

export interface Interaction {
  id: string
  lead_id: string
  user_id: string
  type: InteractionType
  content: string
  metadata?: Record<string, any>
  created_at: string
}

export type InteractionType = 
  | 'note'
  | 'call'
  | 'email'
  | 'whatsapp'
  | 'meeting'
  | 'status_change'
  | 'bot_interaction'

export interface Task {
  id: string
  lead_id?: string
  title: string
  description?: string
  type: TaskType
  priority: TaskPriority
  assigned_to: string
  due_date?: string
  completed: boolean
  completed_at?: string
  created_at: string
}

export type TaskType = 
  | 'call'
  | 'email'
  | 'meeting'
  | 'followup'
  | 'document'
  | 'other'

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface LeadStatusHistory {
  id: string
  lead_id: string
  from_status: LeadStatus
  to_status: LeadStatus
  changed_by: string
  reason?: string
  created_at: string
}
