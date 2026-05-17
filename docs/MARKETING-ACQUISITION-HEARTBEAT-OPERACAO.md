# Operacao: Heartbeat Diario de Aquisicao

Atualizado em 17/05/2026.

## Objetivo

Persistir um snapshot diario de acquisition do Imovex e materializar esse snapshot em Markdown dentro do vault.

O desenho correto ficou em duas camadas:

- a coleta e persistencia vivem no runtime server-side;
- a materializacao em Markdown vive num sync separado, proprio para atualizar o repositório.

Isso evita o erro de tentar fazer um cron serverless editar o Git diretamente.

## Superficies criadas

- tabela: `public.marketing_acquisition_heartbeat_runs`
- backend: `GET /api/marketing/acquisition-heartbeat/cron`
- backend: `GET /api/marketing/acquisition-heartbeat/latest`
- root cron wrapper: `GET /api/marketing/acquisition-heartbeat-cron`
- sync de vault: `npm run ops:imovex:vault:sync-acquisition-heartbeat`
- arquivo auto-gerado: `vault-imovex/10-heartbeat-aquisicao-auto.md`
- workflow GitHub: `.github/workflows/imovex-acquisition-heartbeat-sync.yml`

## O que entra no heartbeat

### 1. Backend

Leitura automatica do overview de marketing ja existente:

- touchpoints
- funil curto
- backlog de conversoes
- sinais de friccao de signup

### 2. Google Ads

Leitura automatica quando as credenciais base ja estao configuradas:

- campanhas no filtro `Imovex` ou filtro customizado
- resumo de 7 dias
- resumo de ontem
- top search terms
- marcação simples de termos suspeitos

### 3. GA4

Leitura automatica opcional via Data API quando houver service account configurada:

- sessions
- engagedSessions
- engagementRate
- eventos principais do funil

### 4. Hotjar

Nao entra como feed automatico de recordings/heatmaps neste heartbeat.

Motivo:

- a API oficial atual do Hotjar e orientada principalmente a Survey Responses e User Lookup;
- ela nao entrega o recorte operacional de recordings/heatmaps usado nesta analise de bounce.

Regra:

- o heartbeat prepara o dia;
- a revisao manual de 3 a 5 gravacoes continua obrigatoria.

## Agendamento recomendado

### Persistencia do snapshot

- arquivo: `vercel.json`
- rota: `/api/marketing/acquisition-heartbeat-cron`
- agenda: `15 11 * * *`
- leitura pratica: 08:15 BRT

### Materializacao no vault

- workflow: `.github/workflows/imovex-acquisition-heartbeat-sync.yml`
- agenda: `25 11 * * *`
- leitura pratica: alguns minutos depois do snapshot diario

O workflow tambem pode disparar o cron remoto antes de sincronizar o arquivo, se `MARKETING_HEARTBEAT_CRON_URL` estiver configurado nos secrets.

## Variaveis de ambiente

### Runtime do heartbeat

- `CRON_SECRET`: obrigatorio
- `SUPABASE_URL`: obrigatorio
- `SUPABASE_SERVICE_ROLE_KEY`: obrigatorio
- `MARKETING_HEARTBEAT_WINDOW_DAYS`: opcional, padrao `7`
- `MARKETING_HEARTBEAT_GOOGLE_ADS_NAME_FILTER`: opcional, fallback para `GOOGLE_ADS_CAMPAIGN_NAME_FILTER`, default `Imovex`

### Google Ads

- `GOOGLE_ADS_DEVELOPER_TOKEN`
- `GOOGLE_ADS_CLIENT_ID`
- `GOOGLE_ADS_CLIENT_SECRET`
- `GOOGLE_ADS_REFRESH_TOKEN`
- `GOOGLE_ADS_CUSTOMER_ID`
- `GOOGLE_ADS_LOGIN_CUSTOMER_ID` opcional

### GA4 opcional

- `GOOGLE_ANALYTICS_PROPERTY_ID`
- `GOOGLE_ANALYTICS_SERVICE_ACCOUNT_CLIENT_EMAIL`
- `GOOGLE_ANALYTICS_SERVICE_ACCOUNT_PRIVATE_KEY`

### GitHub Actions

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CRON_SECRET`
- `MARKETING_HEARTBEAT_CRON_URL` opcional

## Operacao manual

### 1. Rodar o sync completo do vault

```powershell
node scripts/marketing/sync-acquisition-heartbeat-vault.mjs
```

Se `MARKETING_HEARTBEAT_CRON_URL` e `CRON_SECRET` estiverem presentes, o script primeiro dispara o heartbeat remoto e depois baixa o ultimo snapshot para Markdown.

Em execucao local, o script prioriza `.vercel.production.env`, depois `.env.local` e por fim `.env`, para preferir as credenciais de producao quando existirem no workspace.

### 2. Disparar apenas o cron remoto

```powershell
$headers = @{ Authorization = "Bearer $env:CRON_SECRET" }
Invoke-RestMethod -Method Get -Uri "https://immoflow-nine.vercel.app/api/marketing/acquisition-heartbeat-cron" -Headers $headers
```

### 3. Ler o ultimo snapshot pela API principal

Use `GET /api/marketing/acquisition-heartbeat/latest` com sessao admin autenticada.

## O que esperar do arquivo auto-gerado

O arquivo `vault-imovex/10-heartbeat-aquisicao-auto.md` deve sair com:

- status geral
- resumo curto do backend
- resumo de Ads
- resumo de GA4, se configurado
- nota fixa de limitacao do Hotjar
- acoes sugeridas do dia

## Troubleshooting rapido

### Nao gera linha nova na tabela

- verificar `CRON_SECRET`
- verificar `BACKEND_API_URL` ou `VITE_API_URL` no wrapper root
- verificar `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`
- confirmar que a migration `37-marketing-acquisition-heartbeat.sql` foi aplicada

### Google Ads nao entra no snapshot

- verificar credenciais base do Ads
- verificar se a conta tem campanhas com o filtro atual
- verificar se a funcao tem acesso a query GAQL no ambiente ativo

### GA4 nao entra no snapshot

- verificar `GOOGLE_ANALYTICS_PROPERTY_ID`
- verificar permissao da service account na propriedade correta
- verificar se a private key esta chegando com quebras de linha corretas

### Vault nao atualiza no GitHub

- verificar se o workflow tem `contents: write`
- verificar se os secrets do GitHub Actions existem
- verificar se houve mudanca real em `vault-imovex/10-heartbeat-aquisicao-auto.md`

### Sync local falha ao ler o ultimo heartbeat

- confirmar se `.vercel.production.env` tem `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`
- se rodar fora do workspace padrao, exportar `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` manualmente antes do comando

## Regra operacional

- usar o heartbeat para preparar o ritual diario, nao para substituir julgamento operacional
- usar o arquivo auto-gerado como pre-read rapido
- validar Hotjar manualmente antes de mudar copy da LP por causa de bounce