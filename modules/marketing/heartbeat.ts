import crypto from 'crypto'

import { GoogleAdsApi } from 'google-ads-api'

import { supabase } from '../auth/supabase'
import { readMarketingOverview } from './service'

type HeartbeatStatus = 'ok' | 'degraded' | 'failed'
type HeartbeatSourceStatus = 'ok' | 'not_configured' | 'manual_only' | 'failed'
type RunType = 'daily' | 'manual'

type MarketingOverview = Awaited<ReturnType<typeof readMarketingOverview>>

type HeartbeatSource<T> = {
  status: HeartbeatSourceStatus
  updatedAt: string
  details: string | null
  data: T | null
}

type GoogleAdsCampaignSummary = {
  impressions: number | null
  clicks: number | null
  ctr: number | null
  averageCpcMicros: number | null
  costMicros: number | null
  conversions: number | null
  costPerConversion: number | null
}

type GoogleAdsSearchTermSnapshot = {
  term: string
  impressions: number | null
  clicks: number | null
  costMicros: number | null
  conversions: number | null
  suspicious: boolean
}

type GoogleAdsCampaignSnapshot = {
  id: string
  name: string
  status: string | null
  summary7d: GoogleAdsCampaignSummary | null
  summaryYesterday: GoogleAdsCampaignSummary | null
  topSearchTerms: GoogleAdsSearchTermSnapshot[]
}

type GoogleAdsHeartbeatData = {
  filter: string | null
  campaigns: GoogleAdsCampaignSnapshot[]
  suspiciousTerms: GoogleAdsSearchTermSnapshot[]
}

type Ga4HeartbeatData = {
  propertyId: string
  sessions: number | null
  engagedSessions: number | null
  engagementRate: number | null
  events: Record<string, number>
}

type HotjarHeartbeatData = {
  siteId: string | null
  limitation: string
}

type MarketingAcquisitionHeartbeatSnapshot = {
  generatedAt: string
  snapshotDate: string
  windowDays: number
  overallStatus: HeartbeatStatus
  summaryLines: string[]
  actionItems: string[]
  sources: {
    backend: HeartbeatSource<MarketingOverview>
    googleAds: HeartbeatSource<GoogleAdsHeartbeatData>
    ga4: HeartbeatSource<Ga4HeartbeatData>
    hotjar: HeartbeatSource<HotjarHeartbeatData>
  }
}

type MarketingAcquisitionHeartbeatRow = {
  id: string
  run_type: RunType
  status: HeartbeatStatus
  snapshot_date: string
  window_days: number
  source_status: Record<string, unknown>
  summary: Record<string, unknown>
  snapshot: MarketingAcquisitionHeartbeatSnapshot
  action_items: string[]
  markdown: string
  error_message: string | null
  run_started_at: string
  run_finished_at: string | null
}

type Ga4RunReportResponse = {
  rows?: Array<{
    dimensionValues?: Array<{ value?: string }>
    metricValues?: Array<{ value?: string }>
  }>
}

const GA4_SCOPE = 'https://www.googleapis.com/auth/analytics.readonly'
const GA4_TOKEN_URL = 'https://oauth2.googleapis.com/token'
const HOTJAR_LIMITATION = 'A API oficial atual do Hotjar nao entrega feed de recordings/heatmaps para este ritual; manter revisao manual de 3 a 5 gravacoes.'
const SUSPICIOUS_SEARCH_TERM_PATTERNS = [
  /gratis/i,
  /gratuito/i,
  /avali/i,
  /mensaj/i,
  /massiv/i,
  /disparo/i,
  /software/i,
  /sisreg/i,
  /sisdea/i,
  /helena/i,
  /novovista/i,
  /imobia/i,
  /agil/i,
]

function trimString(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null
  }

  const normalized = value.trim()
  return normalized ? normalized : null
}

function toNumber(value: unknown): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null
  }

  if (typeof value === 'string') {
    const normalized = value.trim()
    if (!normalized) {
      return null
    }

    const parsed = Number(normalized)
    return Number.isFinite(parsed) ? parsed : null
  }

  return null
}

function toSortedUnique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort((left, right) => left.localeCompare(right))
}

function readPositiveInt(value: unknown, fallbackValue: number, min: number, max: number) {
  const parsed = toNumber(value)
  if (!parsed) {
    return fallbackValue
  }

  return Math.min(Math.max(Math.round(parsed), min), max)
}

function base64UrlEncode(value: string | Buffer) {
  return Buffer.from(value)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

function readNestedValue(target: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((currentValue, key) => {
    if (!currentValue || typeof currentValue !== 'object') {
      return undefined
    }

    return (currentValue as Record<string, unknown>)[key]
  }, target)
}

function pickFirstValue(target: unknown, paths: string[]): unknown {
  for (const path of paths) {
    const value = readNestedValue(target, path)
    if (value !== undefined) {
      return value
    }
  }

  return undefined
}

function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function isSuspiciousSearchTerm(value: string) {
  const normalized = normalizeText(value)
  return SUSPICIOUS_SEARCH_TERM_PATTERNS.some((pattern) => pattern.test(normalized))
}

function escapeGaqlString(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

function formatPercent(value: number | null) {
  if (value === null) {
    return 'n/d'
  }

  const normalized = value > 1 ? value : value * 100
  return `${Math.round(normalized)}%`
}

function formatMicrosCurrency(value: number | null) {
  if (value === null) {
    return 'n/d'
  }

  return `R$ ${(value / 1_000_000).toFixed(2)}`
}

function toIsoDateInBrazil(iso: string) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
  }).format(new Date(iso))
}

function readGoogleAdsConfig() {
  const developerToken = trimString(process.env.GOOGLE_ADS_DEVELOPER_TOKEN)
  const clientId = trimString(process.env.GOOGLE_ADS_CLIENT_ID)
  const clientSecret = trimString(process.env.GOOGLE_ADS_CLIENT_SECRET)
  const refreshToken = trimString(process.env.GOOGLE_ADS_REFRESH_TOKEN)
  const customerId = trimString(process.env.GOOGLE_ADS_CUSTOMER_ID)
  const loginCustomerId = trimString(process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID)
  const nameFilter = trimString(process.env.MARKETING_HEARTBEAT_GOOGLE_ADS_NAME_FILTER)
    || trimString(process.env.GOOGLE_ADS_CAMPAIGN_NAME_FILTER)
    || 'Imovex'

  return {
    configured: Boolean(developerToken && clientId && clientSecret && refreshToken && customerId),
    developerToken,
    clientId,
    clientSecret,
    refreshToken,
    customerId,
    loginCustomerId,
    nameFilter,
  }
}

function createGoogleAdsCustomer() {
  const config = readGoogleAdsConfig()
  if (!config.configured || !config.customerId) {
    return null
  }

  const api = new GoogleAdsApi({
    client_id: config.clientId!,
    client_secret: config.clientSecret!,
    developer_token: config.developerToken!,
    disable_parsing: true,
  })

  return api.Customer({
    customer_id: config.customerId.replace(/\D/g, ''),
    refresh_token: config.refreshToken!,
    ...(config.loginCustomerId ? { login_customer_id: config.loginCustomerId.replace(/\D/g, '') } : {}),
  }) as any
}

async function listGoogleAdsCampaigns(customer: any, filter: string) {
  const rows = await customer.query(`
    SELECT
      campaign.id,
      campaign.name,
      campaign.status
    FROM campaign
    WHERE campaign.status != 'REMOVED'
      AND campaign.name LIKE '%${escapeGaqlString(filter)}%'
    ORDER BY campaign.id
  `)

  return (rows as unknown[]).map((row) => ({
    id: String(pickFirstValue(row, ['campaign.id']) || ''),
    name: String(pickFirstValue(row, ['campaign.name']) || ''),
    status: trimString(pickFirstValue(row, ['campaign.status'])),
  })).filter((row) => row.id && row.name)
}

async function readGoogleAdsCampaignSummary(customer: any, campaignId: string, dateRange: string): Promise<GoogleAdsCampaignSummary | null> {
  const rows = await customer.query(`
    SELECT
      metrics.impressions,
      metrics.clicks,
      metrics.ctr,
      metrics.average_cpc,
      metrics.cost_micros,
      metrics.conversions,
      metrics.cost_per_conversion
    FROM campaign
    WHERE campaign.id = ${campaignId}
      AND segments.date DURING ${dateRange}
    LIMIT 1
  `)

  const row = Array.isArray(rows) && rows.length > 0 ? rows[0] : null
  if (!row) {
    return null
  }

  return {
    impressions: toNumber(pickFirstValue(row, ['metrics.impressions'])),
    clicks: toNumber(pickFirstValue(row, ['metrics.clicks'])),
    ctr: toNumber(pickFirstValue(row, ['metrics.ctr'])),
    averageCpcMicros: toNumber(pickFirstValue(row, ['metrics.average_cpc', 'metrics.averageCpc'])),
    costMicros: toNumber(pickFirstValue(row, ['metrics.cost_micros', 'metrics.costMicros'])),
    conversions: toNumber(pickFirstValue(row, ['metrics.conversions'])),
    costPerConversion: toNumber(pickFirstValue(row, ['metrics.cost_per_conversion', 'metrics.costPerConversion'])),
  }
}

async function readGoogleAdsSearchTerms(customer: any, campaignId: string, limit: number) {
  const rows = await customer.query(`
    SELECT
      search_term_view.search_term,
      metrics.impressions,
      metrics.clicks,
      metrics.cost_micros,
      metrics.conversions
    FROM search_term_view
    WHERE campaign.id = ${campaignId}
      AND segments.date DURING LAST_7_DAYS
    ORDER BY metrics.impressions DESC
    LIMIT ${limit}
  `)

  return (rows as unknown[]).map((row) => {
    const term = String(pickFirstValue(row, ['search_term_view.search_term', 'searchTermView.searchTerm']) || '')

    return {
      term,
      impressions: toNumber(pickFirstValue(row, ['metrics.impressions'])),
      clicks: toNumber(pickFirstValue(row, ['metrics.clicks'])),
      costMicros: toNumber(pickFirstValue(row, ['metrics.cost_micros', 'metrics.costMicros'])),
      conversions: toNumber(pickFirstValue(row, ['metrics.conversions'])),
      suspicious: term ? isSuspiciousSearchTerm(term) : false,
    } satisfies GoogleAdsSearchTermSnapshot
  }).filter((row) => row.term)
}

function readGa4Config() {
  const propertyId = trimString(process.env.GOOGLE_ANALYTICS_PROPERTY_ID)
  const clientEmail = trimString(process.env.GOOGLE_ANALYTICS_SERVICE_ACCOUNT_CLIENT_EMAIL)
    || trimString(process.env.GOOGLE_ANALYTICS_SERVICE_ACCOUNT_EMAIL)
  const privateKey = trimString(process.env.GOOGLE_ANALYTICS_SERVICE_ACCOUNT_PRIVATE_KEY)

  return {
    configured: Boolean(propertyId && clientEmail && privateKey),
    propertyId,
    clientEmail,
    privateKey: privateKey ? privateKey.replace(/\\n/g, '\n') : null,
  }
}

async function fetchGa4AccessToken(config: ReturnType<typeof readGa4Config>) {
  const issuedAt = Math.floor(Date.now() / 1000)
  const expiresAt = issuedAt + 3600

  const header = { alg: 'RS256', typ: 'JWT' }
  const payload = {
    iss: config.clientEmail,
    sub: config.clientEmail,
    scope: GA4_SCOPE,
    aud: GA4_TOKEN_URL,
    iat: issuedAt,
    exp: expiresAt,
  }

  const encodedHeader = base64UrlEncode(JSON.stringify(header))
  const encodedPayload = base64UrlEncode(JSON.stringify(payload))
  const unsignedToken = `${encodedHeader}.${encodedPayload}`
  const signer = crypto.createSign('RSA-SHA256')
  signer.update(unsignedToken)
  signer.end()

  const signature = signer.sign(config.privateKey || '')
  const assertion = `${unsignedToken}.${base64UrlEncode(signature)}`

  const response = await fetch(GA4_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  })

  const payloadResponse = await response.json() as { access_token?: string; error?: string; error_description?: string }
  if (!response.ok || !payloadResponse.access_token) {
    const detail = payloadResponse.error_description || payloadResponse.error || `HTTP ${response.status}`
    throw new Error(`Falha ao autenticar no GA4 Data API: ${detail}`)
  }

  return payloadResponse.access_token
}

async function runGa4Report(propertyId: string, accessToken: string, body: Record<string, unknown>) {
  const response = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const payload = await response.json() as Record<string, unknown>
  if (!response.ok) {
    const error = payload.error as { message?: string } | undefined
    throw new Error(error?.message || `GA4 Data API retornou HTTP ${response.status}`)
  }

  return payload as Ga4RunReportResponse
}

async function loadBackendHeartbeat(windowDays: number, generatedAt: string): Promise<HeartbeatSource<MarketingOverview>> {
  try {
    const overview = await readMarketingOverview({ windowDays, recentLimit: 8 })
    return {
      status: 'ok',
      updatedAt: generatedAt,
      details: null,
      data: overview,
    }
  } catch (error) {
    return {
      status: 'failed',
      updatedAt: generatedAt,
      details: error instanceof Error ? error.message : 'Erro ao carregar overview do backend',
      data: null,
    }
  }
}

async function loadGoogleAdsHeartbeat(generatedAt: string): Promise<HeartbeatSource<GoogleAdsHeartbeatData>> {
  const config = readGoogleAdsConfig()
  if (!config.configured) {
    return {
      status: 'not_configured',
      updatedAt: generatedAt,
      details: 'Credenciais base do Google Ads nao estao completas para snapshot automatico.',
      data: null,
    }
  }

  try {
    const customer = createGoogleAdsCustomer()
    if (!customer) {
      return {
        status: 'not_configured',
        updatedAt: generatedAt,
        details: 'Nao foi possivel inicializar o cliente do Google Ads.',
        data: null,
      }
    }

    const campaigns = await listGoogleAdsCampaigns(customer, config.nameFilter)
    const snapshots: GoogleAdsCampaignSnapshot[] = []
    const suspiciousTerms: GoogleAdsSearchTermSnapshot[] = []

    for (const campaign of campaigns) {
      const [summary7d, summaryYesterday, topSearchTerms] = await Promise.all([
        readGoogleAdsCampaignSummary(customer, campaign.id, 'LAST_7_DAYS'),
        readGoogleAdsCampaignSummary(customer, campaign.id, 'YESTERDAY'),
        readGoogleAdsSearchTerms(customer, campaign.id, 10),
      ])

      snapshots.push({
        id: campaign.id,
        name: campaign.name,
        status: campaign.status,
        summary7d,
        summaryYesterday,
        topSearchTerms,
      })

      suspiciousTerms.push(...topSearchTerms.filter((term) => term.suspicious))
    }

    return {
      status: 'ok',
      updatedAt: generatedAt,
      details: snapshots.length > 0
        ? null
        : `Nenhuma campanha encontrada com filtro ${config.nameFilter}.`,
      data: {
        filter: config.nameFilter,
        campaigns: snapshots,
        suspiciousTerms: suspiciousTerms.slice(0, 12),
      },
    }
  } catch (error) {
    return {
      status: 'failed',
      updatedAt: generatedAt,
      details: error instanceof Error ? error.message : 'Erro ao consultar Google Ads',
      data: null,
    }
  }
}

async function loadGa4Heartbeat(windowDays: number, generatedAt: string): Promise<HeartbeatSource<Ga4HeartbeatData>> {
  const config = readGa4Config()
  if (!config.configured || !config.propertyId) {
    return {
      status: 'not_configured',
      updatedAt: generatedAt,
      details: 'Credenciais server-side do GA4 Data API ainda nao estao configuradas.',
      data: null,
    }
  }

  try {
    const accessToken = await fetchGa4AccessToken(config)
    const dateRange = {
      startDate: `${windowDays}daysAgo`,
      endDate: 'today',
    }

    const [eventReport, engagementReport] = await Promise.all([
      runGa4Report(config.propertyId, accessToken, {
        dateRanges: [dateRange],
        dimensions: [{ name: 'eventName' }],
        metrics: [{ name: 'eventCount' }],
        dimensionFilter: {
          filter: {
            fieldName: 'eventName',
            inListFilter: {
              values: ['page_view', 'lp_view', 'proof_section_view', 'cta_click', 'signup_started', 'signup_completed'],
            },
          },
        },
        limit: 12,
      }),
      runGa4Report(config.propertyId, accessToken, {
        dateRanges: [dateRange],
        metrics: [{ name: 'sessions' }, { name: 'engagedSessions' }, { name: 'engagementRate' }],
      }),
    ])

    const events: Record<string, number> = {}
    for (const row of eventReport.rows || []) {
      const eventName = row.dimensionValues?.[0]?.value || ''
      const eventCount = toNumber(row.metricValues?.[0]?.value) || 0
      if (eventName) {
        events[eventName] = eventCount
      }
    }

    const engagementRow = (engagementReport.rows || [])[0]
    const metricValues = engagementRow?.metricValues || []

    return {
      status: 'ok',
      updatedAt: generatedAt,
      details: null,
      data: {
        propertyId: config.propertyId,
        sessions: toNumber(metricValues[0]?.value),
        engagedSessions: toNumber(metricValues[1]?.value),
        engagementRate: toNumber(metricValues[2]?.value),
        events,
      },
    }
  } catch (error) {
    return {
      status: 'failed',
      updatedAt: generatedAt,
      details: error instanceof Error ? error.message : 'Erro ao consultar GA4 Data API',
      data: null,
    }
  }
}

function loadHotjarHeartbeat(generatedAt: string): HeartbeatSource<HotjarHeartbeatData> {
  const siteId = trimString(process.env.VITE_HOTJAR_SITE_ID)
    || trimString(process.env.HOTJAR_SITE_ID)

  return {
    status: 'manual_only',
    updatedAt: generatedAt,
    details: HOTJAR_LIMITATION,
    data: {
      siteId,
      limitation: HOTJAR_LIMITATION,
    },
  }
}

function sumCampaignMetric(campaigns: GoogleAdsCampaignSnapshot[], metric: keyof GoogleAdsCampaignSummary) {
  return campaigns.reduce((accumulator, campaign) => accumulator + (campaign.summary7d?.[metric] || 0), 0)
}

function buildSummaryLines(snapshot: Omit<MarketingAcquisitionHeartbeatSnapshot, 'overallStatus' | 'summaryLines' | 'actionItems'>) {
  const lines: string[] = []
  const backendData = snapshot.sources.backend.data
  const googleAdsData = snapshot.sources.googleAds.data
  const ga4Data = snapshot.sources.ga4.data

  if (snapshot.sources.backend.status === 'ok' && backendData) {
    const lpViews = backendData.touchpoints.byEvent.lp_view || 0
    const proofViews = backendData.touchpoints.byEvent.proof_section_view || 0
    const ctaClicks = backendData.funnel.cta_click || 0
    const signupStarted = backendData.funnel.signup_started || 0
    const signupCompleted = backendData.funnel.signup_completed || 0

    lines.push(
      `Backend: ${lpViews} lp_view, ${proofViews} proof_section_view, ${ctaClicks} cta_click, ${signupStarted} signup_started, ${signupCompleted} signup_completed nos ultimos ${snapshot.windowDays} dias.`,
    )
  } else {
    lines.push(`Backend: leitura falhou (${snapshot.sources.backend.details || 'erro sem detalhe'}).`)
  }

  if (snapshot.sources.googleAds.status === 'ok' && googleAdsData) {
    const campaigns = googleAdsData.campaigns
    const clicks = sumCampaignMetric(campaigns, 'clicks')
    const conversions = sumCampaignMetric(campaigns, 'conversions')
    const suspiciousTerms = googleAdsData.suspiciousTerms.map((term) => term.term)

    lines.push(`Google Ads: ${campaigns.length} campanha(s) no filtro ${googleAdsData.filter || 'n/d'}, ${clicks} clique(s) e ${conversions} conversao(oes) em 7 dias.`)

    if (suspiciousTerms.length > 0) {
      lines.push(`Google Ads: termos suspeitos ainda visiveis: ${toSortedUnique(suspiciousTerms).slice(0, 5).join(', ')}.`)
    }
  } else if (snapshot.sources.googleAds.status === 'not_configured') {
    lines.push('Google Ads: snapshot automatico ainda nao configurado no runtime server-side.')
  } else if (snapshot.sources.googleAds.status === 'failed') {
    lines.push(`Google Ads: leitura falhou (${snapshot.sources.googleAds.details || 'erro sem detalhe'}).`)
  }

  if (snapshot.sources.ga4.status === 'ok' && ga4Data) {
    lines.push(`GA4: ${ga4Data.sessions ?? 0} sessions, ${ga4Data.engagedSessions ?? 0} engagedSessions e engagementRate ${formatPercent(ga4Data.engagementRate)}.`)
  } else if (snapshot.sources.ga4.status === 'not_configured') {
    lines.push('GA4: snapshot automatico via Data API ainda nao configurado.')
  } else if (snapshot.sources.ga4.status === 'failed') {
    lines.push(`GA4: leitura falhou (${snapshot.sources.ga4.details || 'erro sem detalhe'}).`)
  }

  lines.push('Hotjar: review manual continua obrigatorio porque a API oficial atual nao cobre recordings/heatmaps deste ritual.')
  return lines
}

function buildActionItems(snapshot: Omit<MarketingAcquisitionHeartbeatSnapshot, 'overallStatus' | 'summaryLines' | 'actionItems'>) {
  const actions: string[] = []
  const backendData = snapshot.sources.backend.data
  const googleAdsData = snapshot.sources.googleAds.data

  if (snapshot.sources.backend.status === 'failed') {
    actions.push('Restaurar a leitura do overview de marketing antes de confiar no heartbeat automatico.')
  }

  if (googleAdsData?.suspiciousTerms.length) {
    const terms = toSortedUnique(googleAdsData.suspiciousTerms.map((term) => term.term)).slice(0, 5)
    actions.push(`Negativar ou revisar termos suspeitos no Google Ads: ${terms.join(', ')}.`)
  }

  if (backendData) {
    const lpViews = backendData.touchpoints.byEvent.lp_view || 0
    const proofViews = backendData.touchpoints.byEvent.proof_section_view || 0
    const ctaClicks = backendData.funnel.cta_click || 0
    const signupStarted = backendData.funnel.signup_started || 0
    const signupCompleted = backendData.funnel.signup_completed || 0

    if (lpViews >= 10 && proofViews <= Math.max(1, Math.floor(lpViews * 0.15))) {
      actions.push('Ajustar LP: pouco trafego chega na prova do produto em relacao ao volume de lp_view.')
    }

    if (lpViews >= 10 && ctaClicks === 0) {
      actions.push('Ajustar LP: existe visita suficiente, mas a CTA principal ainda nao esta convertendo em clique.')
    }

    if (signupStarted > 0 && signupCompleted === 0) {
      actions.push('Investigar auth: existe intencao de cadastro, mas o signup nao esta concluindo.')
    }
  }

  if (snapshot.sources.ga4.status === 'not_configured') {
    actions.push('Configurar credenciais do GA4 Data API para completar o snapshot automatico server-side.')
  }

  actions.push('Manter revisao manual de 3 a 5 gravacoes recentes no Hotjar; a automacao ainda nao substitui comportamento visual.')
  return toSortedUnique(actions)
}

function buildOverallStatus(snapshot: Omit<MarketingAcquisitionHeartbeatSnapshot, 'overallStatus' | 'summaryLines' | 'actionItems'>, actionItems: string[]): HeartbeatStatus {
  if (snapshot.sources.backend.status === 'failed') {
    return 'failed'
  }

  if (snapshot.sources.googleAds.status === 'failed' || snapshot.sources.ga4.status === 'failed') {
    return 'degraded'
  }

  if (actionItems.length > 1) {
    return 'degraded'
  }

  return 'ok'
}

export function renderMarketingAcquisitionHeartbeatMarkdown(snapshot: MarketingAcquisitionHeartbeatSnapshot) {
  const backendData = snapshot.sources.backend.data
  const googleAdsData = snapshot.sources.googleAds.data
  const ga4Data = snapshot.sources.ga4.data

  const sections = [
    '# Heartbeat de Aquisicao Auto',
    '',
    '> Arquivo auto-gerado. Nao editar manualmente.',
    `> Gerado em ${snapshot.generatedAt} para o snapshot local ${snapshot.snapshotDate}.`,
    '',
    `Status geral: ${snapshot.overallStatus}`,
    `Janela: ultimos ${snapshot.windowDays} dias`,
    '',
    '## Resumo',
    ...snapshot.summaryLines.map((line) => `- ${line}`),
    '',
    '## Acoes do Dia',
    ...snapshot.actionItems.map((line) => `- ${line}`),
    '',
    '## Backend',
  ]

  if (backendData) {
    sections.push(`- total de touchpoints: ${backendData.touchpoints.total}`)
    sections.push(`- funil curto: cta_click=${backendData.funnel.cta_click}, signup_started=${backendData.funnel.signup_started}, signup_completed=${backendData.funnel.signup_completed}`)
  } else {
    sections.push(`- indisponivel: ${snapshot.sources.backend.details || 'erro sem detalhe'}`)
  }

  sections.push('', '## Google Ads')

  if (googleAdsData) {
    for (const campaign of googleAdsData.campaigns) {
      sections.push(`- ${campaign.id} | ${campaign.name} | status=${campaign.status || 'n/d'} | 7d clicks=${campaign.summary7d?.clicks ?? 0} | 7d conversions=${campaign.summary7d?.conversions ?? 0} | 7d cost=${formatMicrosCurrency(campaign.summary7d?.costMicros ?? null)}`)
    }

    if (googleAdsData.suspiciousTerms.length > 0) {
      sections.push(`- termos suspeitos: ${toSortedUnique(googleAdsData.suspiciousTerms.map((term) => term.term)).slice(0, 8).join(', ')}`)
    }
  } else {
    sections.push(`- indisponivel: ${snapshot.sources.googleAds.details || 'nao configurado'}`)
  }

  sections.push('', '## GA4')

  if (ga4Data) {
    sections.push(`- propertyId: ${ga4Data.propertyId}`)
    sections.push(`- sessions: ${ga4Data.sessions ?? 0}`)
    sections.push(`- engagedSessions: ${ga4Data.engagedSessions ?? 0}`)
    sections.push(`- engagementRate: ${formatPercent(ga4Data.engagementRate)}`)
    sections.push(`- eventos lidos: ${Object.entries(ga4Data.events).map(([eventName, value]) => `${eventName}=${value}`).join(', ') || 'nenhum'}`)
  } else {
    sections.push(`- indisponivel: ${snapshot.sources.ga4.details || 'nao configurado'}`)
  }

  sections.push('', '## Hotjar', `- ${snapshot.sources.hotjar.details || HOTJAR_LIMITATION}`)
  return `${sections.join('\n')}\n`
}

async function insertHeartbeatRun(params: {
  runType: RunType
  startedAt: string
  finishedAt: string
  status: HeartbeatStatus
  windowDays: number
  snapshot: MarketingAcquisitionHeartbeatSnapshot
  markdown: string
  actionItems: string[]
  errorMessage?: string | null
}) {
  const snapshotDate = params.snapshot.snapshotDate || toIsoDateInBrazil(params.startedAt)
  const sourceStatus = {
    backend: params.snapshot.sources.backend.status,
    googleAds: params.snapshot.sources.googleAds.status,
    ga4: params.snapshot.sources.ga4.status,
    hotjar: params.snapshot.sources.hotjar.status,
  }

  const { data, error } = await supabase
    .from('marketing_acquisition_heartbeat_runs')
    .insert([{
      run_type: params.runType,
      status: params.status,
      snapshot_date: snapshotDate,
      window_days: params.windowDays,
      source_status: sourceStatus,
      summary: { lines: params.snapshot.summaryLines },
      snapshot: params.snapshot,
      action_items: params.actionItems,
      markdown: params.markdown,
      error_message: params.errorMessage ?? null,
      run_started_at: params.startedAt,
      run_finished_at: params.finishedAt,
    }])
    .select('id, run_type, status, snapshot_date, window_days, source_status, summary, snapshot, action_items, markdown, error_message, run_started_at, run_finished_at')
    .maybeSingle()

  if (error) {
    throw new Error(`Erro ao salvar heartbeat de aquisição: ${error.message}`)
  }

  return data as MarketingAcquisitionHeartbeatRow
}

export async function runMarketingAcquisitionHeartbeat(params: { windowDays?: number; runType?: RunType } = {}) {
  const startedAt = new Date().toISOString()
  const windowDays = readPositiveInt(params.windowDays, readPositiveInt(process.env.MARKETING_HEARTBEAT_WINDOW_DAYS, 7, 1, 30), 1, 30)
  const snapshotDate = toIsoDateInBrazil(startedAt)

  const sources = {
    backend: await loadBackendHeartbeat(windowDays, startedAt),
    googleAds: await loadGoogleAdsHeartbeat(startedAt),
    ga4: await loadGa4Heartbeat(windowDays, startedAt),
    hotjar: loadHotjarHeartbeat(startedAt),
  }

  const baseSnapshot = {
    generatedAt: startedAt,
    snapshotDate,
    windowDays,
    sources,
  }

  const summaryLines = buildSummaryLines(baseSnapshot)
  const actionItems = buildActionItems(baseSnapshot)
  const overallStatus = buildOverallStatus(baseSnapshot, actionItems)
  const snapshot: MarketingAcquisitionHeartbeatSnapshot = {
    ...baseSnapshot,
    overallStatus,
    summaryLines,
    actionItems,
  }
  const markdown = renderMarketingAcquisitionHeartbeatMarkdown(snapshot)
  const finishedAt = new Date().toISOString()

  return insertHeartbeatRun({
    runType: params.runType || 'manual',
    startedAt,
    finishedAt,
    status: overallStatus,
    windowDays,
    snapshot,
    markdown,
    actionItems,
  })
}

export async function readLatestMarketingAcquisitionHeartbeat() {
  const { data, error } = await supabase
    .from('marketing_acquisition_heartbeat_runs')
    .select('id, run_type, status, snapshot_date, window_days, source_status, summary, snapshot, action_items, markdown, error_message, run_started_at, run_finished_at')
    .order('run_started_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Erro ao carregar ultimo heartbeat de aquisição: ${error.message}`)
  }

  return (data || null) as MarketingAcquisitionHeartbeatRow | null
}