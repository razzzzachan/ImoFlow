# Heartbeat de Aquisicao Auto

> Arquivo auto-gerado. Nao editar manualmente.
> Gerado em 2026-06-04T14:11:30.217Z para o snapshot local 2026-06-04.

Status geral: degraded
Janela: ultimos 7 dias

## Resumo
- Backend: 75 lp_view, 63 auth_view, 7 proof_section_view, 7 cta_click, 4 signup_started, 4 signup_completed nos ultimos 7 dias.
- Google Ads: 5 campanha(s) no filtro Imovex, 41 clique(s) e 4 conversao(oes) em 7 dias.
- GA4: 105 sessions, 57 engagedSessions e engagementRate 54%.
- Hotjar: fila automatica com 3 caso(s) priorizado(s) em 6 sessao(oes) correlacionadas; lookup por prefixo user/session.

## Acoes do Dia
- Ajustar LP: pouco trafego chega na prova do produto em relacao ao volume de lp_view.
- Revisar fila automatica do Hotjar: signup_completed sem trial ativado (2), lp_view sem chegar na prova (1); a leitura visual continua obrigatoria.

## Backend
- total de touchpoints: 330
- funil curto: cta_click=7, signup_started=4, signup_completed=4

## Google Ads
- 23849461361 | Imovex | Search | Imobiliaria | CRM WhatsApp | status=PAUSED | 7d clicks=41 | 7d conversions=4 | 7d cost=R$ 359.31
- 23853971002 | Imovex | Search | Corretor Solo | CRM Carteira | status=PAUSED | 7d clicks=0 | 7d conversions=0 | 7d cost=R$ 0.00
- 23873069498 | Imovex | Search | Imobiliaria | Bot WhatsApp | status=PAUSED | 7d clicks=0 | 7d conversions=0 | 7d cost=R$ 0.00
- 23879898401 | Imovex | Video | RMKT | Imobiliaria | Ate 1 lead | status=ENABLED | 7d clicks=0 | 7d conversions=0 | 7d cost=R$ 0.00
- 23890353730 | Imovex | Search | Imobiliaria | CRM Gratuito | status=PAUSED | 7d clicks=0 | 7d conversions=0 | 7d cost=R$ 0.00

## GA4
- propertyId: 538032834
- sessions: 105
- engagedSessions: 57
- engagementRate: 54%
- eventos lidos: page_view=485, lp_view=66, auth_form_started=10, cta_click=9, signup_started=7, account_completion_view=6, auth_google_started=6, proof_section_view=6, signup_completed=6, account_completion_started=4, account_completion_completed=3, auth_company_deferred=2, proof_cta_click=1, proof_tour_opened=1, proof_tour_step_viewed=1

## Hotjar
- A API oficial atual do Hotjar nao entrega feed de recordings/heatmaps para este ritual; manter revisao manual de 3 a 5 gravacoes. Fila automatica montada com 3 caso(s) priorizado(s) a partir de 6 sessao(oes) correlacionadas no backend.
- siteId: 6712783
- correlacao automatica: 6 sessoes, 2 touchpoints e 7 conversoes com metadados Hotjar nos itens recentes
- fila automatica de revisao:
  - medium | lp_view sem chegar na prova | lookup=user:c1e19d43 | anon:f10381d8 | site:6712783 | source=public_track | path=/atendimento-imobiliario-com-ia | at=2026-06-03T10:35:24.054+00:00 | trilha=page_view -> lp_view
  - medium | signup_completed sem trial ativado | lookup=user:3bce6e7d | session:0b28ab38 | anon:c9fab8e5 | site:6712783 | source=auth_register | path=n/d | at=2026-05-30T13:19:41.557219+00:00 | trilha=cta_click -> signup_started -> signup_completed
  - medium | signup_completed sem trial ativado | lookup=user:2d475e7d | session:ab621418 | anon:55d4212e | site:6712783 | source=auth_register | path=n/d | at=2026-05-29T13:54:31.166+00:00 | trilha=signup_completed
