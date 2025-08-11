import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { supabase } from '../auth/supabase'

const prefsSchema = z.object({
  api_health_interval_ms: z.number().int().positive().optional(),
  api_health_ok_ms: z.number().int().min(0).optional(),
})

export default async function settingsRoutes(fastify: FastifyInstance) {
  // Obter preferências do usuário atual (com fallback por empresa)
  fastify.get('/preferences', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const userId = (request as any).user.id
      const { data: userRow } = await supabase
        .from('users')
        .select('company_name')
        .eq('id', userId)
        .single()

      const { data: userPrefs, error: userErr } = await supabase
        .from('user_settings')
        .select('preferences')
        .eq('user_id', userId)
        .single()

      if (userErr && userErr.code !== 'PGRST116') { // PGRST116: row not found
        return reply.fail({ message: 'Erro ao buscar preferências do usuário', details: userErr.message }, 500)
      }

      let companyPrefs: any = {}
      if (userRow?.company_name) {
        const { data: companyRow, error: compErr } = await supabase
          .from('company_settings')
          .select('preferences')
          .eq('company_name', userRow.company_name)
          .single()
        if (!compErr && companyRow?.preferences) {
          companyPrefs = companyRow.preferences
        }
      }

      const defaults = { api_health_interval_ms: 30000, api_health_ok_ms: 3000 }
      const preferences = { ...defaults, ...companyPrefs, ...(userPrefs?.preferences || {}) }

      return reply.success({ preferences })
    } catch (err: any) {
      return reply.fail({ message: 'Erro interno ao buscar preferências', details: err?.message }, 500)
    }
  })

  // Salvar preferências a nível de empresa (somente admins/gestores no MVP)
  fastify.put('/preferences/company', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const user = (request as any).user
      const userId = user.id

      // Obter empresa do usuário
      const { data: userRow } = await supabase
        .from('users')
        .select('company_name, role')
        .eq('id', userId)
        .single()

      if (!userRow?.company_name) {
        return reply.fail({ message: 'Usuário sem empresa associada' }, 400)
      }

      if (!['admin', 'gestor'].includes(userRow.role)) {
        return reply.fail({ message: 'Permissão negada' }, 403)
      }

      const parsed = prefsSchema.safeParse(request.body)
      if (!parsed.success) {
        return reply.fail({ message: 'Invalid request', details: parsed.error.issues }, 400)
      }

      // Buscar existentes
      const { data: existing } = await supabase
        .from('company_settings')
        .select('id, preferences')
        .eq('company_name', userRow.company_name)
        .single()

      const newPrefs = { ...(existing?.preferences || {}), ...parsed.data }

      const upsertPayload = existing
        ? { id: existing.id, company_name: userRow.company_name, preferences: newPrefs }
        : { company_name: userRow.company_name, preferences: newPrefs }

      const { error: upsertError } = await supabase
        .from('company_settings')
        .upsert(upsertPayload, { onConflict: 'company_name' })

      if (upsertError) {
        return reply.fail({ message: 'Erro ao salvar preferências da empresa', details: upsertError.message }, 500)
      }

      return reply.success({ preferences: newPrefs })
    } catch (err: any) {
      return reply.fail({ message: 'Erro interno ao salvar preferências da empresa', details: err?.message }, 500)
    }
  })

  // Salvar/atualizar preferências do usuário atual
  fastify.put('/preferences', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const userId = (request as any).user.id
      const parsed = prefsSchema.safeParse(request.body)
      if (!parsed.success) {
        return reply.fail({ message: 'Invalid request', details: parsed.error.issues }, 400)
      }

      const { data: existing } = await supabase
        .from('user_settings')
        .select('id, preferences')
        .eq('user_id', userId)
        .single()

      const newPrefs = { ...(existing?.preferences || {}), ...parsed.data }

      const upsertPayload = existing
        ? { id: existing.id, user_id: userId, preferences: newPrefs }
        : { user_id: userId, preferences: newPrefs }

      const { error: upsertError } = await supabase
        .from('user_settings')
        .upsert(upsertPayload, { onConflict: 'user_id' })

      if (upsertError) {
        return reply.fail({ message: 'Erro ao salvar preferências', details: upsertError.message }, 500)
      }

      return reply.success({ preferences: newPrefs })
    } catch (err: any) {
      return reply.fail({ message: 'Erro interno ao salvar preferências', details: err?.message }, 500)
    }
  })
}