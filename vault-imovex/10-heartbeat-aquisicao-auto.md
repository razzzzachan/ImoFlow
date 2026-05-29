# Heartbeat de Aquisicao Auto

> Arquivo auto-gerado. Nao editar manualmente.
> Gerado em 2026-05-29T14:16:31.140Z para o snapshot local 2026-05-29.

Status geral: degraded
Janela: ultimos 7 dias

## Resumo
- Backend: 184 lp_view, 120 auth_view, 28 proof_section_view, 17 cta_click, 5 signup_started, 5 signup_completed nos ultimos 7 dias.
- Google Ads: 5 campanha(s) no filtro Imovex, 101 clique(s) e 5 conversao(oes) em 7 dias.
- Google Ads: termos suspeitos ainda visiveis: crm imobiliário gratuito, sisdea.
- GA4: 180 sessions, 108 engagedSessions e engagementRate 60%.
- Hotjar: fila automatica com 2 caso(s) priorizado(s) em 2 sessao(oes) correlacionadas; lookup por prefixo user/session.

## Acoes do Dia
- Negativar ou revisar termos suspeitos no Google Ads: crm imobiliário gratuito, sisdea.
- Revisar fila automatica do Hotjar: signup_completed sem trial ativado (2); a leitura visual continua obrigatoria.

## Backend
- total de touchpoints: 731
- funil curto: cta_click=17, signup_started=5, signup_completed=5

## Google Ads
- 23849461361 | Imovex | Search | Imobiliaria | CRM WhatsApp | status=ENABLED | 7d clicks=86 | 7d conversions=5 | 7d cost=R$ 668.84
- 23853971002 | Imovex | Search | Corretor Solo | CRM Carteira | status=PAUSED | 7d clicks=0 | 7d conversions=0 | 7d cost=R$ 0.00
- 23873069498 | Imovex | Search | Imobiliaria | Bot WhatsApp | status=PAUSED | 7d clicks=15 | 7d conversions=0 | 7d cost=R$ 121.48
- 23879898401 | Imovex | Video | RMKT | Imobiliaria | Ate 1 lead | status=ENABLED | 7d clicks=0 | 7d conversions=0 | 7d cost=R$ 0.00
- 23890353730 | Imovex | Search | Imobiliaria | CRM Gratuito | status=PAUSED | 7d clicks=0 | 7d conversions=0 | 7d cost=R$ 0.00
- termos suspeitos: crm imobiliário gratuito, sisdea

## GA4
- propertyId: 538032834
- sessions: 180
- engagedSessions: 108
- engagementRate: 60%
- eventos lidos: page_view=725, lp_view=119, proof_tour_step_viewed=18, proof_section_view=17, cta_click=16, proof_cta_click=13, proof_tour_opened=13, auth_google_started=7, account_completion_view=6, signup_started=6, account_completion_started=5, auth_form_started=4, proof_tour_closed=4, account_completion_completed=3, auth_company_deferred=3, signup_completed=3, trial_crm_first_activated=3

## Hotjar
- A API oficial atual do Hotjar nao entrega feed de recordings/heatmaps para este ritual; manter revisao manual de 3 a 5 gravacoes. Fila automatica montada com 2 caso(s) priorizado(s) a partir de 2 sessao(oes) correlacionadas no backend.
- siteId: 6712783
- correlacao automatica: 2 sessoes, 8 touchpoints e 6 conversoes com metadados Hotjar nos itens recentes
- fila automatica de revisao:
  - medium | signup_completed sem trial ativado | lookup=user:2d475e7d | session:ab621418 | anon:55d4212e | site:6712783 | source=auth_register | path=/login?mode=register&offer=crm-free&utm_source=google&utm_medium=cpc&utm_campaign=imovex_imobiliaria_search&utm_content=software_imobiliario&gclid=Cj0KCQjwz9_QBhD_ARIsADnSCfDKIeUlxqSH9te9MOW1nP353piYT2wCmJHNOA_oU60f1cqJO2rUqPcaAsvZEALw_wcB&gbraid=0AAAAA-hIse9_2pxgDAzEeijrfRReuGsqI&gad_source=1 | at=2026-05-29T13:54:31.166+00:00 | trilha=page_view -> auth_view -> auth_form_started -> signup_started -> register -> signup_completed
  - medium | signup_completed sem trial ativado | lookup=user:69b5327d | session:8611cd1d | anon:472278ad | site:6712783 | source=auth_register | path=n/d | at=2026-05-29T02:40:11.567486+00:00 | trilha=cta_click -> signup_started -> signup_completed
