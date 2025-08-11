import { z } from 'zod'

export const createLeadSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  property_type: z.string().optional(),
  location: z.string().optional(),
  budget_min: z.number().optional(),
  budget_max: z.number().optional(),
  source: z.string().optional(),
  assigned_to: z.string().optional(),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional()
})

export const updateLeadSchema = createLeadSchema.partial().extend({
  status: z
    .enum(['captado', 'em_atendimento', 'visita_marcada', 'proposta', 'negociacao', 'fechado', 'perdido'])
    .optional(),
  lead_score: z.number().min(0).max(100).optional(),
  next_followup: z.string().optional()
})

export const getLeadsQuerySchema = z.object({
  status: z.string().optional(),
  assigned_to: z.string().optional(),
  source: z.string().optional(),
  property_type: z.string().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional()
})

export const bulkUpdateStatusSchema = z.object({
  lead_ids: z.array(z.string().min(1)),
  status: z.string().min(1),
  reason: z.string().optional()
})

