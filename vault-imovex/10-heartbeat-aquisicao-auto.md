# Heartbeat de Aquisicao Auto

> Arquivo auto-gerado. Nao editar manualmente.
> Gerado em 2026-06-01T16:59:12.978Z para o snapshot local 2026-06-01.

Status geral: degraded
Janela: ultimos 7 dias

## Resumo
- Backend: 117 lp_view, 91 auth_view, 17 proof_section_view, 12 cta_click, 5 signup_started, 5 signup_completed nos ultimos 7 dias.
- Google Ads: 5 campanha(s) no filtro Imovex, 74 clique(s) e 6 conversao(oes) em 7 dias.
- GA4: 156 sessions, 93 engagedSessions e engagementRate 60%.
- Hotjar: fila automatica com 2 caso(s) priorizado(s) em 4 sessao(oes) correlacionadas; lookup por prefixo user/session.

## Acoes do Dia
- Ajustar LP: pouco trafego chega na prova do produto em relacao ao volume de lp_view.
- Revisar fila automatica do Hotjar: signup_completed sem trial ativado (2); a leitura visual continua obrigatoria.

## Backend
- total de touchpoints: 515
- funil curto: cta_click=12, signup_started=5, signup_completed=5

## Google Ads
- 23849461361 | Imovex | Search | Imobiliaria | CRM WhatsApp | status=PAUSED | 7d clicks=74 | 7d conversions=6 | 7d cost=R$ 572.42
- 23853971002 | Imovex | Search | Corretor Solo | CRM Carteira | status=PAUSED | 7d clicks=0 | 7d conversions=0 | 7d cost=R$ 0.00
- 23873069498 | Imovex | Search | Imobiliaria | Bot WhatsApp | status=PAUSED | 7d clicks=0 | 7d conversions=0 | 7d cost=R$ 0.00
- 23879898401 | Imovex | Video | RMKT | Imobiliaria | Ate 1 lead | status=ENABLED | 7d clicks=0 | 7d conversions=0 | 7d cost=R$ 0.00
- 23890353730 | Imovex | Search | Imobiliaria | CRM Gratuito | status=PAUSED | 7d clicks=0 | 7d conversions=0 | 7d cost=R$ 0.00

## GA4
- propertyId: 538032834
- sessions: 156
- engagedSessions: 93
- engagementRate: 60%
- eventos lidos: page_view=643, lp_view=94, cta_click=15, proof_section_view=12, auth_google_started=11, auth_form_started=10, signup_started=9, account_completion_view=8, proof_tour_step_viewed=8, account_completion_started=6, proof_cta_click=6, proof_tour_opened=6, signup_completed=6, account_completion_completed=5, auth_company_deferred=4, proof_tour_closed=1, trial_crm_first_activated=1

## Hotjar
- A API oficial atual do Hotjar nao entrega feed de recordings/heatmaps para este ritual; manter revisao manual de 3 a 5 gravacoes. Fila automatica montada com 2 caso(s) priorizado(s) a partir de 4 sessao(oes) correlacionadas no backend.
- siteId: 6712783
- correlacao automatica: 4 sessoes, 6 touchpoints e 7 conversoes com metadados Hotjar nos itens recentes
- fila automatica de revisao:
  - medium | signup_completed sem trial ativado | lookup=user:3bce6e7d | session:0b28ab38 | anon:c9fab8e5 | site:6712783 | source=auth_register | path=n/d | at=2026-05-30T13:19:41.557219+00:00 | trilha=cta_click -> signup_started -> signup_completed
  - medium | signup_completed sem trial ativado | lookup=user:2d475e7d | session:ab621418 | anon:55d4212e | site:6712783 | source=auth_register | path=n/d | at=2026-05-29T13:54:31.166+00:00 | trilha=cta_click -> signup_started -> signup_completed
