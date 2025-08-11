import { z } from 'zod'

export const createBotSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  mode: z.enum(['assistido', 'avancado']).optional()
})

export const createFlowSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional()
})

export const messageSchema = z.object({
  channel_user_id: z.string().min(1),
  message: z.string().min(1),
  channel: z.string().optional()
})

