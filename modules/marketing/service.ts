import crypto from 'crypto'

import { GoogleAdsApi } from 'google-ads-api'

import { supabase } from '../auth/supabase'
import { resolveTrialState } from '../settings/limits'
import {
  buildGoogleAdsClickConversion,
  buildMarketingConversionDedupKey,
  normalizeMarketingAttribution,
  shouldRetryGoogleAdsUpload,
  type MarketingAttribution,
  type MarketingConversionEventType,
} from './conversions'

type ConversionActionEnvByEvent = Record<MarketingConversionEventType, string>

type TouchpointRow = {
  id: string
  anonymous_id: string | null
  user_id: string | null
  company_id: string | null
  email: string | null
  source: string
  event_type: string
  page_path: string | null
  target: string | null
  attribution: MarketingAttribution | null
  metadata: Record<string, unknown> | null
  click_id_type: 'gclid' | 'gbraid' | 'wbraid' | null
  click_id: string | null
  occurred_at: string
}

type ConversionEventRow = {
  id: string
  dedupe_key: string
  status: 'pending' | 'processing' | 'uploaded' | 'failed' | 'skipped'
  event_type: MarketingConversionEventType
  source: string
  anonymous_id: string | null
  user_id: string | null
  company_id: string | null
  email: string | null
  value: number | null
  currency_code: string | null
  order_id: string | null
  attribution: MarketingAttribution | null
  metadata: Record<string, unknown> | null
  click_id_type: 'gclid' | 'gbraid' | 'wbraid' | null
  click_id: string | null
  event_time: string
  upload_attempts: number | null
  next_retry_at: string | null
  last_error?: string | null
  last_uploaded_at?: string | null
  google_ads_action?: string | null
}

type CompanyCurrentPlanRow = {
  company_id: string
  plan_code: string | null
  plan_name: string | null
  price_monthly: number | null
  preferences: Record<string, unknown> | null
}

type CompanySettingsRow = {
  company_id: string
  company_name: string | null
  preferences: Record<string, unknown> | null
}

const CONVERSION_ACTION_ENV_BY_EVENT: ConversionActionEnvByEvent = {
  cta_click: 'GOOGLE_ADS_CONVERSION_ACTION_CTA_CLICK',
  signup_started: 'GOOGLE_ADS_CONVERSION_ACTION_SIGNUP_STARTED',
  signup_completed: 'GOOGLE_ADS_CONVERSION_ACTION_SIGNUP_COMPLETED',
  trial_crm_first_activated: 'GOOGLE_ADS_CONVERSION_ACTION_TRIAL_CRM_FIRST_ACTIVATED',
  commercial_contact_requested: 'GOOGLE_ADS_CONVERSION_ACTION_COMMERCIAL_CONTACT_REQUESTED',
  plan_upgrade: 'GOOGLE_ADS_CONVERSION_ACTION_PLAN_UPGRADE',
  topup_purchase: 'GOOGLE_ADS_CONVERSION_ACTION_TOPUP_PURCHASE',
}

function trimString(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null
  }

  const normalized = value.trim()
  return normalized ? normalized : null
}

function readGoogleAdsBaseConfig() {
  const developerToken = trimString(process.env.GOOGLE_ADS_DEVELOPER_TOKEN)
  const clientId = trimString(process.env.GOOGLE_ADS_CLIENT_ID)
  const clientSecret = trimString(process.env.GOOGLE_ADS_CLIENT_SECRET)
  const refreshToken = trimString(process.env.GOOGLE_ADS_REFRESH_TOKEN)
  const customerId = trimString(process.env.GOOGLE_ADS_CONVERSION_CUSTOMER_ID)
    || trimString(process.env.GOOGLE_ADS_CUSTOMER_ID)
  const loginCustomerId = trimString(process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID)

  const configured = Boolean(developerToken && clientId && clientSecret && refreshToken && customerId)

  return {
    configured,
    developerToken,
    clientId,
    clientSecret,
    refreshToken,
    customerId,
    loginCustomerId,
  }
}

function readGoogleAdsLookbackDays(): number {
  const rawValue = Number(process.env.GOOGLE_ADS_ATTRIBUTION_LOOKBACK_DAYS || '90')
  if (!Number.isFinite(rawValue) || rawValue <= 0) {
    return 90
  }

  return Math.min(Math.max(Math.round(rawValue), 1), 180)
}

function readConversionActionForEvent(eventType: MarketingConversionEventType): string | null {
  const envKey = CONVERSION_ACTION_ENV_BY_EVENT[eventType]
  return trimString(process.env[envKey])
}

function createGoogleAdsCustomer() {
  const config = readGoogleAdsBaseConfig()

  if (!config.configured || !config.customerId) {
    return null
  }

  const api = new GoogleAdsApi({
    client_id: config.clientId!,
    client_secret: config.clientSecret!,
    developer_token: config.developerToken!,
    disable_parsing: true,
  })

  return {
    customerId: config.customerId,
    customer: api.Customer({
      customer_id: config.customerId.replace(/\D/g, ''),
      refresh_token: config.refreshToken!,
      ...(config.loginCustomerId ? { login_customer_id: config.loginCustomerId.replace(/\D/g, '') } : {}),
    }),
  }
}

function getRetryDelayMinutes(attemptCount: number): number {
  if (attemptCount <= 1) return 5
  if (attemptCount === 2) return 30
  if (attemptCount === 3) return 120
  if (attemptCount === 4) return 360
  return 1440
}

function buildNextRetryAt(attemptCount: number): string {
  const nextRetry = new Date()
  nextRetry.setMinutes(nextRetry.getMinutes() + getRetryDelayMinutes(attemptCount))
  return nextRetry.toISOString()
}

function hashNormalizedEmail(email?: string | null): string | null {
  const normalizedEmail = trimString(email)?.toLowerCase()
  if (!normalizedEmail) {
    return null
  }

  return crypto.createHash('sha256').update(normalizedEmail).digest('hex')
}

function buildPartialFailureMessage(response: any): string | null {
  const partialFailureError = response?.partial_failure_error ?? response?.partialFailureError ?? null
  if (!partialFailureError) {
    return null
  }

  if (typeof partialFailureError === 'string') {
    return partialFailureError
  }

  try {
    return JSON.stringify(partialFailureError)
  } catch {
    return 'Partial failure no upload de conversão do Google Ads'
  }
}

async function selectTouchpointBy(column: 'user_id' | 'company_id' | 'email' | 'anonymous_id', value: string, cutoffIso: string) {
  const { data, error } = await supabase
    .from('marketing_attribution_touchpoints')
    .select('id, anonymous_id, user_id, company_id, email, source, event_type, page_path, target, attribution, metadata, click_id_type, click_id, occurred_at')
    .eq(column, value)
    .not('click_id', 'is', null)
    .gte('occurred_at', cutoffIso)
    .order('occurred_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Erro ao buscar touchpoint de marketing (${column}): ${error.message}`)
  }

  return (data || null) as TouchpointRow | null
}

async function loadConversionEventById(eventId: string) {
  const { data, error } = await supabase
    .from('marketing_conversion_events')
    .select('id, dedupe_key, status, event_type, source, anonymous_id, user_id, company_id, email, value, currency_code, order_id, attribution, metadata, click_id_type, click_id, event_time, upload_attempts, next_retry_at')
    .eq('id', eventId)
    .maybeSingle()

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Erro ao carregar evento de conversão: ${error.message}`)
  }

  return (data || null) as ConversionEventRow | null
}

async function updateConversionEvent(eventId: string, patch: Record<string, unknown>) {
  const payload = {
    ...patch,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase
    .from('marketing_conversion_events')
    .update(payload)
    .eq('id', eventId)

  if (error) {
    throw new Error(`Erro ao atualizar evento de conversão: ${error.message}`)
  }
}

export async function captureMarketingTouchpoint(params: {
  source: string
  eventType: string
  anonymousId?: string | null
  userId?: string | null
  companyId?: string | null
  email?: string | null
  pagePath?: string | null
  target?: string | null
  occurredAt?: string | null
  attribution?: unknown
  metadata?: Record<string, unknown> | null
}) {
  const normalizedAttribution = normalizeMarketingAttribution(params.attribution)
  const clickIdType = normalizedAttribution?.gclid
    ? 'gclid'
    : normalizedAttribution?.wbraid
      ? 'wbraid'
      : normalizedAttribution?.gbraid
        ? 'gbraid'
        : null

  const clickId = clickIdType ? normalizedAttribution?.[clickIdType] || null : null
  const hasMeaningfulPayload = Boolean(
    normalizedAttribution ||
    trimString(params.anonymousId) ||
    trimString(params.email) ||
    trimString(params.pagePath) ||
    trimString(params.target)
  )

  if (!hasMeaningfulPayload) {
    return null
  }

  const occurredAt = trimString(params.occurredAt) || new Date().toISOString()

  const { data, error } = await supabase
    .from('marketing_attribution_touchpoints')
    .insert([{
      anonymous_id: trimString(params.anonymousId),
      user_id: trimString(params.userId),
      company_id: trimString(params.companyId),
      email: trimString(params.email),
      source: params.source,
      event_type: params.eventType,
      page_path: trimString(params.pagePath),
      target: trimString(params.target),
      attribution: normalizedAttribution || {},
      metadata: params.metadata || {},
      click_id_type: clickIdType,
      click_id: clickId,
      occurred_at: occurredAt,
    }])
    .select('id, anonymous_id, user_id, company_id, email, source, event_type, page_path, target, attribution, metadata, click_id_type, click_id, occurred_at')
    .maybeSingle()

  if (error) {
    throw new Error(`Erro ao registrar touchpoint de marketing: ${error.message}`)
  }

  return (data || null) as TouchpointRow | null
}

export async function linkAnonymousMarketingIdentity(params: {
  anonymousId?: string | null
  userId?: string | null
  companyId?: string | null
  email?: string | null
}) {
  const anonymousId = trimString(params.anonymousId)
  if (!anonymousId) {
    return
  }

  const identityPayload = {
    user_id: trimString(params.userId),
    company_id: trimString(params.companyId),
    email: trimString(params.email),
    updated_at: new Date().toISOString(),
  }

  const { error: touchpointError } = await supabase
    .from('marketing_attribution_touchpoints')
    .update(identityPayload)
    .eq('anonymous_id', anonymousId)

  if (touchpointError) {
    throw new Error(`Erro ao vincular touchpoints anônimos: ${touchpointError.message}`)
  }

  const { error: conversionError } = await supabase
    .from('marketing_conversion_events')
    .update(identityPayload)
    .eq('anonymous_id', anonymousId)

  if (conversionError) {
    throw new Error(`Erro ao vincular eventos de conversão anônimos: ${conversionError.message}`)
  }
}

export async function recordAuthenticatedMarketingTouchpoint(params: {
  source: string
  eventType: string
  anonymousId?: string | null
  userId?: string | null
  companyId?: string | null
  email?: string | null
  pagePath?: string | null
  target?: string | null
  occurredAt?: string | null
  attribution?: unknown
  metadata?: Record<string, unknown> | null
}) {
  await linkAnonymousMarketingIdentity({
    anonymousId: params.anonymousId,
    userId: params.userId,
    companyId: params.companyId,
    email: params.email,
  })

  return captureMarketingTouchpoint(params)
}

export async function resolveLatestMarketingAttribution(params: {
  userId?: string | null
  companyId?: string | null
  email?: string | null
  anonymousId?: string | null
  lookbackDays?: number
}) {
  const lookbackDays = params.lookbackDays || readGoogleAdsLookbackDays()
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - lookbackDays)
  const cutoffIso = cutoff.toISOString()

  const candidates: Array<{ column: 'user_id' | 'company_id' | 'email' | 'anonymous_id'; value: string | null }> = [
    { column: 'user_id', value: trimString(params.userId) },
    { column: 'email', value: trimString(params.email) },
    { column: 'company_id', value: trimString(params.companyId) },
    { column: 'anonymous_id', value: trimString(params.anonymousId) },
  ]

  for (const candidate of candidates) {
    if (!candidate.value) {
      continue
    }

    const row = await selectTouchpointBy(candidate.column, candidate.value, cutoffIso)
    if (row?.click_id && row.attribution) {
      return {
        attribution: normalizeMarketingAttribution(row.attribution),
        clickId: row.click_id,
        clickIdType: row.click_id_type,
        occurredAt: row.occurred_at,
        source: row.source,
      }
    }
  }

  return null
}

export async function queueMarketingConversionEvent(params: {
  eventType: MarketingConversionEventType
  source: string
  anonymousId?: string | null
  userId?: string | null
  companyId?: string | null
  email?: string | null
  pagePath?: string | null
  target?: string | null
  eventTime?: string | null
  value?: number | null
  currencyCode?: string | null
  orderId?: string | null
  attribution?: unknown
  metadata?: Record<string, unknown> | null
  dedupeKey?: string | null
  dispatchNow?: boolean
}) {
  const eventTime = trimString(params.eventTime) || new Date().toISOString()
  const resolvedAttribution = normalizeMarketingAttribution(params.attribution)
    || (await resolveLatestMarketingAttribution({
      userId: params.userId,
      companyId: params.companyId,
      email: params.email,
      anonymousId: params.anonymousId,
    }))?.attribution
    || null

  const clickIdType = resolvedAttribution?.gclid
    ? 'gclid'
    : resolvedAttribution?.wbraid
      ? 'wbraid'
      : resolvedAttribution?.gbraid
        ? 'gbraid'
        : null

  const clickId = clickIdType ? resolvedAttribution?.[clickIdType] || null : null
  const dedupeKey = trimString(params.dedupeKey) || buildMarketingConversionDedupKey({
    eventType: params.eventType,
    eventTime,
    orderId: params.orderId,
    anonymousId: params.anonymousId,
    userId: params.userId,
    companyId: params.companyId,
    pagePath: params.pagePath,
    target: params.target,
  })

  const payload = {
    dedupe_key: dedupeKey,
    event_type: params.eventType,
    source: params.source,
    anonymous_id: trimString(params.anonymousId),
    user_id: trimString(params.userId),
    company_id: trimString(params.companyId),
    email: trimString(params.email),
    value: Number.isFinite(params.value as number) ? Number(params.value) : 0,
    currency_code: trimString(params.currencyCode) || 'BRL',
    order_id: trimString(params.orderId),
    attribution: resolvedAttribution || {},
    metadata: params.metadata || {},
    click_id_type: clickIdType,
    click_id: clickId,
    status: 'pending',
    upload_attempts: 0,
    next_retry_at: new Date().toISOString(),
    event_time: eventTime,
    updated_at: new Date().toISOString(),
  }

  const { data: insertedRow, error: insertError } = await supabase
    .from('marketing_conversion_events')
    .upsert(payload, { onConflict: 'dedupe_key', ignoreDuplicates: true })
    .select('id, dedupe_key, status, event_type, source, anonymous_id, user_id, company_id, email, value, currency_code, order_id, attribution, metadata, click_id_type, click_id, event_time, upload_attempts, next_retry_at')
    .maybeSingle()

  if (insertError) {
    throw new Error(`Erro ao enfileirar evento de conversão: ${insertError.message}`)
  }

  const eventRow = insertedRow
    ? (insertedRow as ConversionEventRow)
    : await supabase
        .from('marketing_conversion_events')
        .select('id, dedupe_key, status, event_type, source, anonymous_id, user_id, company_id, email, value, currency_code, order_id, attribution, metadata, click_id_type, click_id, event_time, upload_attempts, next_retry_at')
        .eq('dedupe_key', dedupeKey)
        .maybeSingle()
        .then((result) => {
          if (result.error) {
            throw new Error(`Erro ao carregar evento de conversão enfileirado: ${result.error.message}`)
          }

          return (result.data || null) as ConversionEventRow | null
        })

  if (trimString(params.anonymousId) && (trimString(params.userId) || trimString(params.companyId) || trimString(params.email))) {
    await linkAnonymousMarketingIdentity({
      anonymousId: params.anonymousId,
      userId: params.userId,
      companyId: params.companyId,
      email: params.email,
    })
  }

  if (eventRow && params.dispatchNow !== false) {
    await maybeDispatchMarketingConversionEvent(eventRow)
  }

  return eventRow
}

export async function maybeDispatchMarketingConversionEvent(eventOrId: string | ConversionEventRow) {
  const event = typeof eventOrId === 'string'
    ? await loadConversionEventById(eventOrId)
    : eventOrId

  if (!event) {
    return { status: 'missing' as const }
  }

  if (event.status === 'uploaded' || event.status === 'skipped') {
    return { status: event.status }
  }

  const customerContext = createGoogleAdsCustomer()
  const conversionAction = readConversionActionForEvent(event.event_type)
  const attemptCount = Number(event.upload_attempts || 0) + 1

  if (!customerContext || !conversionAction) {
    await updateConversionEvent(event.id, {
      status: 'pending',
      upload_attempts: attemptCount,
      next_retry_at: buildNextRetryAt(attemptCount),
      last_error: !customerContext
        ? 'Credenciais base do Google Ads ainda não configuradas para upload de conversões.'
        : `Conversion action ausente para o evento ${event.event_type}.`,
    })

    return { status: 'deferred' as const }
  }

  const conversionPayload = buildGoogleAdsClickConversion({
    customerId: customerContext.customerId,
    conversionAction,
    defaultCurrencyCode: event.currency_code || 'BRL',
    event: {
      eventType: event.event_type,
      eventTime: event.event_time,
      value: typeof event.value === 'number' ? event.value : Number(event.value || 0),
      currencyCode: event.currency_code,
      orderId: event.order_id,
      attribution: event.attribution,
    },
  })

  if (!conversionPayload) {
    await updateConversionEvent(event.id, {
      status: 'skipped',
      upload_attempts: attemptCount,
      next_retry_at: null,
      last_error: 'Evento sem gclid, wbraid ou gbraid disponível para upload ao Google Ads.',
    })

    return { status: 'skipped' as const }
  }

  const hashedEmail = hashNormalizedEmail(event.email)
  if (hashedEmail) {
    ;(conversionPayload as any).user_identifiers = [{ hashed_email: hashedEmail }]
  }

  try {
    const response = await (customerContext.customer as any).conversionUploads.uploadClickConversions({
      customer_id: customerContext.customerId.replace(/\D/g, ''),
      conversions: [conversionPayload],
      partial_failure: true,
      validate_only: false,
    })

    const partialFailureMessage = buildPartialFailureMessage(response)
    if (partialFailureMessage) {
      if (shouldRetryGoogleAdsUpload(partialFailureMessage)) {
        await updateConversionEvent(event.id, {
          status: 'pending',
          upload_attempts: attemptCount,
          next_retry_at: buildNextRetryAt(attemptCount),
          last_error: partialFailureMessage,
        })

        return { status: 'deferred' as const }
      }

      await updateConversionEvent(event.id, {
        status: 'failed',
        upload_attempts: attemptCount,
        next_retry_at: null,
        last_error: partialFailureMessage,
      })

      return { status: 'failed' as const }
    }

    await updateConversionEvent(event.id, {
      status: 'uploaded',
      upload_attempts: attemptCount,
      next_retry_at: null,
      last_error: null,
      last_uploaded_at: new Date().toISOString(),
      google_ads_job_id: response?.job_id ?? response?.jobId ?? null,
      google_ads_action: conversionAction,
    })

    return { status: 'uploaded' as const }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error || 'Erro desconhecido no upload de conversão')
    if (shouldRetryGoogleAdsUpload(error)) {
      await updateConversionEvent(event.id, {
        status: 'pending',
        upload_attempts: attemptCount,
        next_retry_at: buildNextRetryAt(attemptCount),
        last_error: message,
      })

      return { status: 'deferred' as const }
    }

    await updateConversionEvent(event.id, {
      status: 'failed',
      upload_attempts: attemptCount,
      next_retry_at: null,
      last_error: message,
    })

    return { status: 'failed' as const }
  }
}

export async function flushPendingMarketingConversionEvents(limit: number = 25) {
  const nowIso = new Date().toISOString()
  const safeLimit = Number.isFinite(limit) ? Math.max(1, Math.min(Math.round(limit), 100)) : 25

  const { data, error } = await supabase
    .from('marketing_conversion_events')
    .select('id, dedupe_key, status, event_type, source, anonymous_id, user_id, company_id, email, value, currency_code, order_id, attribution, metadata, click_id_type, click_id, event_time, upload_attempts, next_retry_at')
    .in('status', ['pending', 'failed'])
    .lte('next_retry_at', nowIso)
    .order('next_retry_at', { ascending: true })
    .limit(safeLimit)

  if (error) {
    throw new Error(`Erro ao buscar fila de conversões pendentes: ${error.message}`)
  }

  const rows = (data || []) as ConversionEventRow[]
  const summary = {
    processed: rows.length,
    uploaded: 0,
    skipped: 0,
    failed: 0,
    deferred: 0,
  }

  for (const row of rows) {
    const result = await maybeDispatchMarketingConversionEvent(row)
    if (result.status === 'uploaded') summary.uploaded += 1
    else if (result.status === 'skipped') summary.skipped += 1
    else if (result.status === 'failed') summary.failed += 1
    else if (result.status === 'deferred') summary.deferred += 1
  }

  return summary
}

function incrementCount(map: Record<string, number>, rawKey: unknown) {
  const key = trimString(rawKey) || 'unknown'
  map[key] = (map[key] || 0) + 1
}

function toSortedEntries(map: Record<string, number>, limit: number = 5) {
  return Object.entries(map)
    .sort((left, right) => right[1] - left[1])
    .slice(0, limit)
    .map(([key, count]) => ({ key, count }))
}

function getDaysUntil(targetIso: string): number {
  const target = new Date(targetIso).getTime()
  const now = Date.now()
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24))
}

export async function readMarketingOverview(params: {
  windowDays?: number
  recentLimit?: number
} = {}) {
  const now = new Date()
  const windowDays = Number.isFinite(params.windowDays)
    ? Math.min(Math.max(Math.round(params.windowDays || 7), 1), 90)
    : 7
  const recentLimit = Number.isFinite(params.recentLimit)
    ? Math.min(Math.max(Math.round(params.recentLimit || 8), 1), 25)
    : 8

  const since = new Date(now)
  since.setDate(since.getDate() - windowDays)

  const sinceIso = since.toISOString()
  const nowIso = now.toISOString()

  const touchpointColumns = 'id, anonymous_id, user_id, company_id, email, source, event_type, page_path, target, attribution, click_id_type, click_id, occurred_at'
  const conversionColumns = 'id, dedupe_key, status, event_type, source, anonymous_id, user_id, company_id, email, value, currency_code, attribution, metadata, click_id_type, click_id, event_time, upload_attempts, next_retry_at, last_error, last_uploaded_at, google_ads_action'

  const [
    touchpointsResult,
    recentTouchpointsResult,
    conversionsResult,
    recentConversionsResult,
    readyToFlushResult,
    backlogResult,
    companyCurrentPlanResult,
    companySettingsResult,
  ] = await Promise.all([
    supabase
      .from('marketing_attribution_touchpoints')
      .select(touchpointColumns)
      .gte('occurred_at', sinceIso),
    supabase
      .from('marketing_attribution_touchpoints')
      .select(touchpointColumns)
      .gte('occurred_at', sinceIso)
      .order('occurred_at', { ascending: false })
      .limit(recentLimit),
    supabase
      .from('marketing_conversion_events')
      .select(conversionColumns)
      .gte('event_time', sinceIso),
    supabase
      .from('marketing_conversion_events')
      .select(conversionColumns)
      .gte('event_time', sinceIso)
      .order('event_time', { ascending: false })
      .limit(recentLimit),
    supabase
      .from('marketing_conversion_events')
      .select('id', { count: 'exact', head: true })
      .in('status', ['pending', 'failed'])
      .lte('next_retry_at', nowIso),
    supabase
      .from('marketing_conversion_events')
      .select('id', { count: 'exact', head: true })
      .in('status', ['pending', 'failed']),
    supabase
      .from('company_current_plan')
      .select('company_id, plan_code, plan_name, price_monthly, preferences'),
    supabase
      .from('company_settings')
      .select('company_id, company_name, preferences'),
  ])

  if (touchpointsResult.error) {
    throw new Error(`Erro ao carregar touchpoints de marketing: ${touchpointsResult.error.message}`)
  }

  if (recentTouchpointsResult.error) {
    throw new Error(`Erro ao carregar touchpoints recentes de marketing: ${recentTouchpointsResult.error.message}`)
  }

  if (conversionsResult.error) {
    throw new Error(`Erro ao carregar eventos de conversão de marketing: ${conversionsResult.error.message}`)
  }

  if (recentConversionsResult.error) {
    throw new Error(`Erro ao carregar conversões recentes de marketing: ${recentConversionsResult.error.message}`)
  }

  if (readyToFlushResult.error) {
    throw new Error(`Erro ao contar conversões prontas para flush: ${readyToFlushResult.error.message}`)
  }

  if (backlogResult.error) {
    throw new Error(`Erro ao contar backlog de conversões: ${backlogResult.error.message}`)
  }

  if (companyCurrentPlanResult.error) {
    throw new Error(`Erro ao carregar mix atual de planos: ${companyCurrentPlanResult.error.message}`)
  }

  if (companySettingsResult.error && companySettingsResult.error.code !== 'PGRST116') {
    throw new Error(`Erro ao carregar dados comerciais das empresas: ${companySettingsResult.error.message}`)
  }

  const touchpoints = (touchpointsResult.data || []) as TouchpointRow[]
  const recentTouchpoints = (recentTouchpointsResult.data || []) as TouchpointRow[]
  const conversions = (conversionsResult.data || []) as ConversionEventRow[]
  const recentConversions = (recentConversionsResult.data || []) as ConversionEventRow[]
  const companyCurrentPlans = (companyCurrentPlanResult.data || []) as CompanyCurrentPlanRow[]
  const companySettings = (companySettingsResult.data || []) as CompanySettingsRow[]

  const touchpointsByEvent: Record<string, number> = {}
  const touchpointsBySource: Record<string, number> = {}
  const touchpointsByPath: Record<string, number> = {}
  let touchpointsWithClickId = 0
  let identifiedTouchpoints = 0

  for (const row of touchpoints) {
    incrementCount(touchpointsByEvent, row.event_type)
    incrementCount(touchpointsBySource, row.source)
    incrementCount(touchpointsByPath, row.page_path || row.target || 'sem-path')

    if (row.click_id) {
      touchpointsWithClickId += 1
    }

    if (row.user_id || row.company_id || row.email) {
      identifiedTouchpoints += 1
    }
  }

  const conversionsByEvent: Record<string, number> = {}
  const conversionsByStatus: Record<string, number> = {}
  const topupsByCompany: Record<string, number> = {}
  let uploadedCount = 0
  let failedCount = 0

  for (const row of conversions) {
    incrementCount(conversionsByEvent, row.event_type)
    incrementCount(conversionsByStatus, row.status)

    if (row.event_type === 'topup_purchase' && row.company_id) {
      incrementCount(topupsByCompany, row.company_id)
    }

    if (row.status === 'uploaded') {
      uploadedCount += 1
    }

    if (row.status === 'failed') {
      failedCount += 1
    }
  }

  const signupStarted = touchpointsByEvent.signup_started || 0
  const signupCompleted = conversionsByEvent.signup_completed || 0
  const trialActivated = conversionsByEvent.trial_crm_first_activated || 0
  const companySettingsById = new Map(companySettings.map((row) => [row.company_id, row]))
  const planMixMap = new Map<string, { planCode: string | null; planName: string; count: number }>()
  const trialStatus = {
    active: 0,
    grace: 0,
    expired: 0,
    converted: 0,
  }
  let trialsEndingSoon = 0

  const upsellCandidatesByCompany = new Map<string, {
    companyId: string
    companyName: string
    planCode: string | null
    planName: string | null
    trialStatus: 'active' | 'grace' | 'expired' | 'converted' | null
    trialEndsAt: string | null
    topupPurchases: number
    reasons: string[]
    priorityScore: number
  }>()

  const registerUpsellCandidate = (params: {
    companyId: string
    companyName: string
    planCode: string | null
    planName: string | null
    trialStatus: 'active' | 'grace' | 'expired' | 'converted' | null
    trialEndsAt: string | null
    topupPurchases: number
    reason: string
    priorityScore: number
  }) => {
    const existing = upsellCandidatesByCompany.get(params.companyId)
    if (existing) {
      if (!existing.reasons.includes(params.reason)) {
        existing.reasons.push(params.reason)
      }

      existing.topupPurchases = Math.max(existing.topupPurchases, params.topupPurchases)
      existing.priorityScore = Math.max(existing.priorityScore, params.priorityScore)
      existing.trialStatus = existing.trialStatus || params.trialStatus
      existing.trialEndsAt = existing.trialEndsAt || params.trialEndsAt
      return
    }

    upsellCandidatesByCompany.set(params.companyId, {
      companyId: params.companyId,
      companyName: params.companyName,
      planCode: params.planCode,
      planName: params.planName,
      trialStatus: params.trialStatus,
      trialEndsAt: params.trialEndsAt,
      topupPurchases: params.topupPurchases,
      reasons: [params.reason],
      priorityScore: params.priorityScore,
    })
  }

  for (const row of companyCurrentPlans) {
    const companyMeta = companySettingsById.get(row.company_id)
    const mergedPreferences = {
      ...((row.preferences || {}) as Record<string, unknown>),
      ...((companyMeta?.preferences || {}) as Record<string, unknown>),
    }

    const trial = resolveTrialState(mergedPreferences)
    const topupPurchases = topupsByCompany[row.company_id] || 0
    const companyName = trimString(companyMeta?.company_name) || `Empresa ${row.company_id.slice(0, 8)}`

    let effectivePlanCode = trimString(row.plan_code)
    let effectivePlanName = trimString(row.plan_name) || effectivePlanCode || 'Sem plano definido'

    if (trial) {
      trialStatus[trial.status] += 1

      if (trial.status !== 'converted') {
        effectivePlanCode = 'trial-crm-first'
        effectivePlanName = 'Trial CRM-first qualificado'
      }

      if (trial.status === 'active' && trial.endsAt) {
        const daysUntilTrialEnds = getDaysUntil(trial.endsAt)
        if (daysUntilTrialEnds <= 3) {
          trialsEndingSoon += 1
          registerUpsellCandidate({
            companyId: row.company_id,
            companyName,
            planCode: effectivePlanCode,
            planName: effectivePlanName,
            trialStatus: trial.status,
            trialEndsAt: trial.endsAt,
            topupPurchases,
            reason: `Trial termina em ${Math.max(daysUntilTrialEnds, 0)} dia(s).`,
            priorityScore: 2,
          })
        }
      }

      if (trial.status === 'grace') {
        registerUpsellCandidate({
          companyId: row.company_id,
          companyName,
          planCode: effectivePlanCode,
          planName: effectivePlanName,
          trialStatus: trial.status,
          trialEndsAt: trial.graceEndsAt,
          topupPurchases,
          reason: 'Trial em modo leitura; precisa upgrade para voltar a operar.',
          priorityScore: 3,
        })
      }

      if (trial.status === 'expired') {
        registerUpsellCandidate({
          companyId: row.company_id,
          companyName,
          planCode: effectivePlanCode,
          planName: effectivePlanName,
          trialStatus: trial.status,
          trialEndsAt: trial.graceEndsAt,
          topupPurchases,
          reason: 'Trial expirado; precisa recuperação comercial ou fechamento.',
          priorityScore: 3,
        })
      }
    }

    const planKey = `${effectivePlanCode || 'unknown'}::${effectivePlanName}`
    const existingPlanMix = planMixMap.get(planKey)
    if (existingPlanMix) {
      existingPlanMix.count += 1
    } else {
      planMixMap.set(planKey, {
        planCode: effectivePlanCode,
        planName: effectivePlanName,
        count: 1,
      })
    }

    if (topupPurchases > 0 && (!trial || trial.status === 'converted')) {
      registerUpsellCandidate({
        companyId: row.company_id,
        companyName,
        planCode: effectivePlanCode,
        planName: effectivePlanName,
        trialStatus: trial?.status || null,
        trialEndsAt: trial?.endsAt || null,
        topupPurchases,
        reason: `Comprou ${topupPurchases} saldo(s) extra(s) no recorte; pode indicar necessidade de upgrade estrutural.`,
        priorityScore: 1,
      })
    }
  }

  const recentRevenueSignals = recentConversions
    .filter((row) => row.event_type === 'plan_upgrade' || row.event_type === 'topup_purchase')
    .map((row) => ({
      id: row.id,
      companyId: row.company_id,
      companyName: trimString(row.company_id ? companySettingsById.get(row.company_id)?.company_name : null)
        || (row.company_id ? `Empresa ${row.company_id.slice(0, 8)}` : 'Empresa não identificada'),
      eventType: row.event_type,
      status: row.status,
      eventTime: row.event_time,
      value: row.value,
      currencyCode: row.currency_code,
    }))

  return {
    windowDays,
    since: sinceIso,
    until: nowIso,
    readiness: {
      googleAdsBaseConfigured: readGoogleAdsBaseConfig().configured,
      conversionActions: {
        signup_started: Boolean(readConversionActionForEvent('signup_started')),
        signup_completed: Boolean(readConversionActionForEvent('signup_completed')),
        trial_crm_first_activated: Boolean(readConversionActionForEvent('trial_crm_first_activated')),
        commercial_contact_requested: Boolean(readConversionActionForEvent('commercial_contact_requested')),
      },
    },
    funnel: {
      cta_click: touchpointsByEvent.cta_click || 0,
      signup_started: signupStarted,
      signup_completed: signupCompleted,
      trial_crm_first_activated: trialActivated,
      commercial_contact_requested: touchpointsByEvent.commercial_contact_requested || 0,
      signupStartToCompleteRate: signupStarted > 0
        ? Math.round((signupCompleted / signupStarted) * 100)
        : null,
      signupCompleteToActivationRate: signupCompleted > 0
        ? Math.round((trialActivated / signupCompleted) * 100)
        : null,
    },
    touchpoints: {
      total: touchpoints.length,
      identified: identifiedTouchpoints,
      withClickId: touchpointsWithClickId,
      byEvent: touchpointsByEvent,
      bySource: touchpointsBySource,
      topPaths: toSortedEntries(touchpointsByPath),
    },
    conversions: {
      total: conversions.length,
      uploaded: uploadedCount,
      failed: failedCount,
      readyToFlush: readyToFlushResult.count || 0,
      backlogPending: backlogResult.count || 0,
      byEvent: conversionsByEvent,
      byStatus: conversionsByStatus,
    },
    commerce: {
      signals: {
        planUpgrades: conversionsByEvent.plan_upgrade || 0,
        topupPurchases: conversionsByEvent.topup_purchase || 0,
        trialsEndingSoon,
        trialsInGrace: trialStatus.grace,
        trialsExpired: trialStatus.expired,
      },
      trialStatus,
      planMix: Array.from(planMixMap.values()).sort((left, right) => right.count - left.count),
      upsellCandidates: Array.from(upsellCandidatesByCompany.values())
        .sort((left, right) => right.priorityScore - left.priorityScore || left.companyName.localeCompare(right.companyName))
        .slice(0, 8)
        .map((row) => ({
          companyId: row.companyId,
          companyName: row.companyName,
          planCode: row.planCode,
          planName: row.planName,
          trialStatus: row.trialStatus,
          trialEndsAt: row.trialEndsAt,
          topupPurchases: row.topupPurchases,
          reasons: row.reasons,
          priority: row.priorityScore >= 3 ? 'high' : 'medium',
        })),
      recentRevenueSignals,
    },
    recent: {
      touchpoints: recentTouchpoints,
      conversions: recentConversions,
    },
  }
}