import fs from 'node:fs'
import path from 'node:path'

for (const envFile of ['.vercel.production.env', '.env.local', '.env']) {
  loadEnvFile(path.resolve(process.cwd(), envFile))
}

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return
  }

  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/)
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) {
      continue
    }

    const separatorIndex = line.indexOf('=')
    if (separatorIndex === -1) {
      continue
    }

    const key = line.slice(0, separatorIndex).trim()
    if (!key || process.env[key]) {
      continue
    }

    let value = line.slice(separatorIndex + 1).trim()
    if (
      value.length >= 2
      && ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'")))
    ) {
      value = value.slice(1, -1)
    }

    process.env[key] = value
  }
}

function readRequiredEnv(name) {
  const value = process.env[name]?.trim()
  if (!value) {
    throw new Error(`${name} is required`)
  }

  return value
}

function buildPlaceholderDocument() {
  return [
    '# Heartbeat de Aquisicao Auto',
    '',
    '> Arquivo auto-gerado. Nao editar manualmente.',
    '> Ainda nao existe snapshot persistido em marketing_acquisition_heartbeat_runs.',
    '',
    'Rode `node scripts/marketing/sync-acquisition-heartbeat-vault.mjs` com as credenciais adequadas ou aguarde o workflow diario.',
    '',
  ].join('\n')
}

function readSupabaseConfig() {
  const supabaseUrl = readRequiredEnv('SUPABASE_URL')
  const supabaseServiceRoleKey = readRequiredEnv('SUPABASE_SERVICE_ROLE_KEY')

  return {
    supabaseUrl: supabaseUrl.replace(/\/+$/, ''),
    supabaseServiceRoleKey,
  }
}

async function readLatestHeartbeatMarkdown() {
  const { supabaseUrl, supabaseServiceRoleKey } = readSupabaseConfig()
  const queryUrl = new URL('/rest/v1/marketing_acquisition_heartbeat_runs', `${supabaseUrl}/`)
  queryUrl.searchParams.set('select', 'markdown')
  queryUrl.searchParams.set('order', 'run_started_at.desc')
  queryUrl.searchParams.set('limit', '1')

  const response = await fetch(queryUrl.toString(), {
    method: 'GET',
    headers: {
      apikey: supabaseServiceRoleKey,
      Authorization: `Bearer ${supabaseServiceRoleKey}`,
      Accept: 'application/json',
    },
  })

  const text = await response.text()
  if (!response.ok) {
    throw new Error(`Erro ao ler heartbeat mais recente: HTTP ${response.status} ${text}`)
  }

  let rows = []
  if (text.trim()) {
    try {
      rows = JSON.parse(text)
    } catch (error) {
      throw new Error(`Erro ao interpretar payload do heartbeat mais recente: ${error instanceof Error ? error.message : 'payload invalido'}`)
    }
  }

  const markdown = Array.isArray(rows) && rows.length > 0 ? rows[0]?.markdown : null
  return typeof markdown === 'string' && markdown.trim() ? markdown : null
}

async function triggerHeartbeatIfConfigured() {
  const triggerUrl = process.env.MARKETING_HEARTBEAT_CRON_URL?.trim()
  const cronSecret = process.env.CRON_SECRET?.trim()

  if (!triggerUrl || !cronSecret) {
    return null
  }

  const response = await fetch(triggerUrl, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${cronSecret}`,
      'x-cron-secret': cronSecret,
    },
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Falha ao disparar heartbeat remoto: HTTP ${response.status} ${text}`)
  }

  return response.json().catch(() => null)
}

async function main() {
  await triggerHeartbeatIfConfigured()

  const document = await readLatestHeartbeatMarkdown() || buildPlaceholderDocument()

  const outputPath = path.resolve(process.cwd(), 'vault-imovex/10-heartbeat-aquisicao-auto.md')
  fs.writeFileSync(outputPath, document, 'utf8')
  console.log(`Heartbeat sincronizado em ${outputPath}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})