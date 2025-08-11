import { z } from 'zod'

export const leadSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  property_type: z.string().optional(),
  location: z.string().optional(),
  budget_min: z.number().optional(),
  budget_max: z.number().optional(),
  status: z.string(),
  source: z.string().optional(),
  created_at: z.string(),
  assigned_user: z
    .object({
      name: z.string(),
      email: z.string().optional()
    })
    .optional()
})

export type Lead = z.infer<typeof leadSchema>

const envelopeSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: dataSchema.optional(),
    error: z
      .object({ code: z.string().optional(), message: z.string(), details: z.any().optional() })
      .nullable()
      .optional(),
    meta: z.any().nullable().optional()
  })

const baseUrl = '/api/crm'

export async function getLeads(token: string, params?: Record<string, any>) {
  const qs = params
    ? '?' + new URLSearchParams(Object.entries(params).filter(([, v]) => v != null && v !== '') as any)
    : ''
  const res = await fetch(`${baseUrl}/leads${qs}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  const json = await res.json()
  const parsed = envelopeSchema(
    z.object({
      leads: z.array(leadSchema),
      pagination: z.any()
    })
  ).parse(json)
  if ((parsed as any).error) throw new Error((parsed as any).error.message)
  return (parsed as any).data as { leads: Lead[]; pagination: any }
}

export async function createLead(token: string, payload: { name: string; email?: string; phone?: string; whatsapp?: string; source?: string }) {
  const res = await fetch(`${baseUrl}/leads`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  })
  const json = await res.json()
  const parsed = envelopeSchema(z.object({ lead: leadSchema })).parse(json)
  if ((parsed as any).error) throw new Error((parsed as any).error.message)
  return (parsed as any).data.lead as Lead
}

export async function updateLead(token: string, id: string, payload: Record<string, any>) {
  const res = await fetch(`${baseUrl}/leads/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  })
  const json = await res.json()
  const parsed = envelopeSchema(z.object({ lead: leadSchema })).parse(json)
  if ((parsed as any).error) throw new Error((parsed as any).error.message)
  return (parsed as any).data.lead as Lead
}

export async function assignLead(token: string, id: string, assigned_to: string) {
  const res = await fetch(`${baseUrl}/leads/${id}/assign`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ assigned_to })
  })
  const json = await res.json()
  const parsed = envelopeSchema(z.object({ lead: leadSchema })).parse(json)
  if ((parsed as any).error) throw new Error((parsed as any).error.message)
  return (parsed as any).data.lead as Lead
}

export async function bulkUpdateStatus(token: string, lead_ids: string[], status: string, reason?: string) {
  const res = await fetch(`${baseUrl}/leads/bulk-status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ lead_ids, status, reason })
  })
  const json = await res.json()
  const parsed = envelopeSchema(z.object({ results: z.any() })).parse(json)
  if ((parsed as any).error) throw new Error((parsed as any).error.message)
  return (parsed as any).data.results as any
}

