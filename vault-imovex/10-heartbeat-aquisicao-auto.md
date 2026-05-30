# Heartbeat de Aquisicao Auto

> Arquivo auto-gerado. Nao editar manualmente.
> Gerado em 2026-05-30T12:42:24.564Z para o snapshot local 2026-05-30.

Status geral: degraded
Janela: ultimos 7 dias

## Resumo
- Backend: 175 lp_view, 126 auth_view, 25 proof_section_view, 16 cta_click, 5 signup_started, 5 signup_completed nos ultimos 7 dias.
- Google Ads: 5 campanha(s) no filtro Imovex, 110 clique(s) e 6 conversao(oes) em 7 dias.
- Google Ads: termos suspeitos ainda visiveis: sisdea.
- GA4: 188 sessions, 99 engagedSessions e engagementRate 53%.
- Hotjar: fila automatica com 3 caso(s) priorizado(s) em 3 sessao(oes) correlacionadas; lookup por prefixo user/session.

## Acoes do Dia
- Ajustar LP: pouco trafego chega na prova do produto em relacao ao volume de lp_view.
- Negativar ou revisar termos suspeitos no Google Ads: sisdea.
- Revisar fila automatica do Hotjar: signup_completed sem trial ativado (2), cta_click sem signup_started (1); a leitura visual continua obrigatoria.

## Backend
- total de touchpoints: 720
- funil curto: cta_click=16, signup_started=5, signup_completed=5

## Google Ads
- 23849461361 | Imovex | Search | Imobiliaria | CRM WhatsApp | status=ENABLED | 7d clicks=95 | 7d conversions=6 | 7d cost=R$ 739.28
- 23853971002 | Imovex | Search | Corretor Solo | CRM Carteira | status=PAUSED | 7d clicks=0 | 7d conversions=0 | 7d cost=R$ 0.00
- 23873069498 | Imovex | Search | Imobiliaria | Bot WhatsApp | status=PAUSED | 7d clicks=15 | 7d conversions=0 | 7d cost=R$ 121.48
- 23879898401 | Imovex | Video | RMKT | Imobiliaria | Ate 1 lead | status=ENABLED | 7d clicks=0 | 7d conversions=0 | 7d cost=R$ 0.00
- 23890353730 | Imovex | Search | Imobiliaria | CRM Gratuito | status=PAUSED | 7d clicks=0 | 7d conversions=0 | 7d cost=R$ 0.00
- termos suspeitos: sisdea

## GA4
- propertyId: 538032834
- sessions: 188
- engagedSessions: 99
- engagementRate: 53%
- eventos lidos: page_view=751, lp_view=120, cta_click=17, proof_section_view=16, proof_tour_step_viewed=11, auth_form_started=9, signup_started=9, auth_google_started=8, proof_cta_click=8, proof_tour_opened=8, signup_completed=7, account_completion_view=6, account_completion_started=5, account_completion_completed=3, auth_company_deferred=3, trial_crm_first_activated=2, proof_tour_closed=1

## Hotjar
- A API oficial atual do Hotjar nao entrega feed de recordings/heatmaps para este ritual; manter revisao manual de 3 a 5 gravacoes. Fila automatica montada com 3 caso(s) priorizado(s) a partir de 3 sessao(oes) correlacionadas no backend.
- siteId: 6712783
- correlacao automatica: 3 sessoes, 6 touchpoints e 7 conversoes com metadados Hotjar nos itens recentes
- fila automatica de revisao:
  - medium | cta_click sem signup_started | lookup=user:51b6b464 | session:1d8fb404 | anon:9b5ae38f | site:6712783 | source=public_track | path=/login?mode=register&offer=crm-free&utm_source=google&utm_medium=cpc&utm_campaign=imovex_imobiliaria_search&utm_content=comparativo_crm_imobiliaria&gclid=CjwKCAjw8uTQBhAdEiwAVvtJylVAu1xoLHlOmu3q_XOAWWKfbHG_FlW_rhZl6wn2YKVvpZPUhW5mNRoC5dIQAvD_BwE&gbraid=0AAAAA-hIse8Qn_gAnNx6VJ4Us22zBPSbw&gad_source=1 | at=2026-05-30T03:27:18.951+00:00 | trilha=cta_click -> page_view -> auth_view -> page_view -> auth_view -> page_view
  - medium | signup_completed sem trial ativado | lookup=user:2d475e7d | session:ab621418 | anon:55d4212e | site:6712783 | source=auth_register | path=n/d | at=2026-05-29T13:54:31.166+00:00 | trilha=cta_click -> signup_started -> signup_completed
  - medium | signup_completed sem trial ativado | lookup=user:69b5327d | session:8611cd1d | anon:472278ad | site:6712783 | source=auth_register | path=n/d | at=2026-05-29T02:40:11.567486+00:00 | trilha=cta_click -> signup_started -> signup_completed
