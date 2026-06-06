# Heartbeat de Aquisicao Auto

> Arquivo auto-gerado. Nao editar manualmente.
> Gerado em 2026-06-06T12:47:28.940Z para o snapshot local 2026-06-06.

Status geral: degraded
Janela: ultimos 7 dias

## Resumo
- Backend: 41 lp_view, 21 auth_view, 2 proof_section_view, 4 cta_click, 2 signup_started, 2 signup_completed nos ultimos 7 dias.
- Google Ads: 5 campanha(s) no filtro Imovex, 6 clique(s) e 1 conversao(oes) em 7 dias.
- Google Ads: termos suspeitos ainda visiveis: programa para avaliar imoveis.
- GA4: 50 sessions, 21 engagedSessions e engagementRate 42%.
- Hotjar: fila automatica com 2 caso(s) priorizado(s) em 4 sessao(oes) correlacionadas; lookup por prefixo user/session.

## Acoes do Dia
- Ajustar LP: pouco trafego chega na prova do produto em relacao ao volume de lp_view.
- Negativar ou revisar termos suspeitos no Google Ads: programa para avaliar imoveis.
- Revisar fila automatica do Hotjar: signup_completed sem trial ativado (2); a leitura visual continua obrigatoria.

## Backend
- total de touchpoints: 149
- funil curto: cta_click=4, signup_started=2, signup_completed=2

## Google Ads
- 23849461361 | Imovex | Search | Imobiliaria | CRM WhatsApp | status=PAUSED | 7d clicks=6 | 7d conversions=1 | 7d cost=R$ 78.94
- 23853971002 | Imovex | Search | Corretor Solo | CRM Carteira | status=PAUSED | 7d clicks=0 | 7d conversions=0 | 7d cost=R$ 0.00
- 23873069498 | Imovex | Search | Imobiliaria | Bot WhatsApp | status=PAUSED | 7d clicks=0 | 7d conversions=0 | 7d cost=R$ 0.00
- 23879898401 | Imovex | Video | RMKT | Imobiliaria | Ate 1 lead | status=ENABLED | 7d clicks=0 | 7d conversions=0 | 7d cost=R$ 0.00
- 23890353730 | Imovex | Search | Imobiliaria | CRM Gratuito | status=PAUSED | 7d clicks=0 | 7d conversions=0 | 7d cost=R$ 0.00
- termos suspeitos: programa para avaliar imoveis

## GA4
- propertyId: 538032834
- sessions: 50
- engagedSessions: 21
- engagementRate: 42%
- eventos lidos: page_view=149, lp_view=28, cta_click=6, auth_form_started=5, auth_google_started=4, account_completion_completed=3, account_completion_view=3, account_completion_started=2, auth_company_deferred=2, signup_started=2, proof_section_view=1, signup_completed=1

## Hotjar
- A API oficial atual do Hotjar nao entrega feed de recordings/heatmaps para este ritual; manter revisao manual de 3 a 5 gravacoes. Fila automatica montada com 2 caso(s) priorizado(s) a partir de 4 sessao(oes) correlacionadas no backend.
- siteId: 6712783
- correlacao automatica: 4 sessoes, 0 touchpoints e 6 conversoes com metadados Hotjar nos itens recentes
- fila automatica de revisao:
  - medium | signup_completed sem trial ativado | lookup=user:f50b61f0 | session:623ba27e | anon:80a5ee20 | site:6712783 | source=auth_register | path=n/d | at=2026-06-05T21:34:52.806+00:00 | trilha=cta_click -> signup_started -> signup_completed
  - medium | signup_completed sem trial ativado | lookup=user:3bce6e7d | session:0b28ab38 | anon:c9fab8e5 | site:6712783 | source=auth_register | path=n/d | at=2026-05-30T13:19:41.557219+00:00 | trilha=signup_completed
