import crypto from 'crypto'

export const MARKETING_ATTRIBUTION_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'utm_id',
  'gclid',
  'gbraid',
  'wbraid',
  'gad_source',
  'fbclid',
  'campaign_id',
  'ad_group_id',
  'creative',
  'keyword',
  'matchtype',
  'network',
  'device',
] as const

export type MarketingAttributionKey = (typeof MARKETING_ATTRIBUTION_KEYS)[number]

export type MarketingAttribution = Partial<Record<MarketingAttributionKey, string>>

export type MarketingConversionEventType =
  | 'cta_click'
  | 'signup_started'
  | 'signup_completed'
  | 'trial_crm_first_activated'
  | 'commercial_contact_requested'
  | 'plan_upgrade'
  | 'topup_purchase'

export const PUBLIC_MARKETING_TOUCHPOINT_EVENTS = [
  'page_view',
  'lp_view',
  'proof_section_view',
  'cta_click',
  'signup_started',
  'commercial_contact_requested',
] as const

export type PublicMarketingTouchpointEventType = (typeof PUBLIC_MARKETING_TOUCHPOINT_EVENTS)[number]

export type MarketingClickIdentifierField = 'gclid' | 'wbraid' | 'gbraid'

export type MarketingClickIdentifier = {
  field: MarketingClickIdentifierField
  value: string
}

export type MarketingConversionRecord = {
  eventType: MarketingConversionEventType
  eventTime: string
  value?: number | null
  currencyCode?: string | null
  orderId?: string | null
  attribution?: MarketingAttribution | null
}

const CLICK_IDENTIFIER_PRIORITY: MarketingClickIdentifierField[] = ['gclid', 'wbraid', 'gbraid']
const PUBLIC_MARKETING_CONVERSION_EVENT_SET = new Set<PublicMarketingTouchpointEventType>([
  'cta_click',
  'signup_started',
  'commercial_contact_requested',
])

function trimString(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null
  }

  const normalized = value.trim()
  return normalized ? normalized : null
}

function formatTimezoneOffset(date: Date): string {
  const offsetMinutes = -date.getTimezoneOffset()
  const sign = offsetMinutes >= 0 ? '+' : '-'
  const absoluteMinutes = Math.abs(offsetMinutes)
  const hours = String(Math.floor(absoluteMinutes / 60)).padStart(2, '0')
  const minutes = String(absoluteMinutes % 60).padStart(2, '0')

  return `${sign}${hours}:${minutes}`
}

export function normalizeMarketingAttribution(raw: unknown): MarketingAttribution | null {
  if (!raw || typeof raw !== 'object') {
    return null
  }

  const source = raw as Record<string, unknown>
  const normalized: MarketingAttribution = {}

  for (const key of MARKETING_ATTRIBUTION_KEYS) {
    const value = trimString(source[key])
    if (value) {
      normalized[key] = value
    }
  }

  return Object.keys(normalized).length > 0 ? normalized : null
}

export function getMarketingClickIdentifier(attribution?: MarketingAttribution | null): MarketingClickIdentifier | null {
  if (!attribution) {
    return null
  }

  for (const field of CLICK_IDENTIFIER_PRIORITY) {
    const value = trimString(attribution[field])
    if (value) {
      return { field, value }
    }
  }

  return null
}

export function formatGoogleAdsConversionDateTime(input: string | Date): string {
  const date = input instanceof Date ? input : new Date(input)

  if (Number.isNaN(date.getTime())) {
    throw new Error('Data inválida para conversão do Google Ads')
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}${formatTimezoneOffset(date)}`
}

export function normalizeGoogleAdsConversionActionResourceName(customerId: string, conversionAction: string): string {
  const normalizedCustomerId = trimString(customerId)?.replace(/\D/g, '')
  if (!normalizedCustomerId) {
    throw new Error('Customer ID do Google Ads é obrigatório')
  }

  const normalizedAction = trimString(conversionAction)
  if (!normalizedAction) {
    throw new Error('Conversion action do Google Ads é obrigatória')
  }

  if (normalizedAction.startsWith('customers/')) {
    return normalizedAction
  }

  const actionId = normalizedAction.replace(/\D/g, '')
  if (!actionId) {
    throw new Error('Conversion action do Google Ads deve ser um resource name ou ID numérico')
  }

  return `customers/${normalizedCustomerId}/conversionActions/${actionId}`
}

export function buildMarketingConversionDedupKey(params: {
  eventType: MarketingConversionEventType
  eventTime: string
  orderId?: string | null
  anonymousId?: string | null
  userId?: string | null
  companyId?: string | null
  pagePath?: string | null
  target?: string | null
}): string {
  const hash = crypto.createHash('sha256')
  hash.update([
    params.eventType,
    params.orderId || '',
    params.userId || '',
    params.companyId || '',
    params.anonymousId || '',
    params.pagePath || '',
    params.target || '',
    params.eventTime,
  ].join('|'))

  return hash.digest('hex')
}

export function buildGoogleAdsClickConversion(params: {
  customerId: string
  conversionAction: string
  event: MarketingConversionRecord
  defaultCurrencyCode?: string
}) {
  const attribution = normalizeMarketingAttribution(params.event.attribution)
  const clickIdentifier = getMarketingClickIdentifier(attribution)

  if (!clickIdentifier) {
    return null
  }

  const payload: Record<string, unknown> = {
    conversion_action: normalizeGoogleAdsConversionActionResourceName(params.customerId, params.conversionAction),
    conversion_date_time: formatGoogleAdsConversionDateTime(params.event.eventTime),
    conversion_value: Number.isFinite(params.event.value as number) ? Number(params.event.value) : 0,
    currency_code: trimString(params.event.currencyCode) || trimString(params.defaultCurrencyCode) || 'BRL',
  }

  payload[clickIdentifier.field] = clickIdentifier.value

  const orderId = trimString(params.event.orderId)
  if (orderId) {
    payload.order_id = orderId
  }

  return payload
}

export function shouldQueuePublicMarketingConversionEvent(
  eventType: PublicMarketingTouchpointEventType,
): eventType is Extract<PublicMarketingTouchpointEventType, 'cta_click' | 'signup_started' | 'commercial_contact_requested'> {
  return PUBLIC_MARKETING_CONVERSION_EVENT_SET.has(eventType)
}

export function shouldRetryGoogleAdsUpload(error: unknown): boolean {
  const message = error instanceof Error
    ? `${error.name} ${error.message}`
    : typeof error === 'string'
      ? error
      : JSON.stringify(error || {})

  const normalized = message.toLowerCase()

  return [
    'timeout',
    'deadline exceeded',
    'temporarily unavailable',
    'internal error',
    'backend error',
    'service unavailable',
    'unavailable',
    'connection reset',
    'econnreset',
    'etimedout',
    'socket hang up',
    'resource exhausted',
    'quota_error',
  ].some((fragment) => normalized.includes(fragment))
}