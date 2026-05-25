# Heartbeat de Aquisicao Auto

> Arquivo auto-gerado. Nao editar manualmente.
> Gerado em 2026-05-25T14:18:39.959Z para o snapshot local 2026-05-25.

Status geral: degraded
Janela: ultimos 7 dias

## Resumo
- Backend: 189 lp_view, 98 auth_view, 30 proof_section_view, 22 cta_click, 10 signup_started, 10 signup_completed nos ultimos 7 dias.
- Google Ads: 3 campanha(s) no filtro Imovex, 97 clique(s) e 6 conversao(oes) em 7 dias.
- Google Ads: termos suspeitos ainda visiveis: crm imobiliário gratuito, crm software.
- GA4: 211 sessions, 112 engagedSessions e engagementRate 53%.
- Hotjar: fila automatica com 3 caso(s) priorizado(s) em 7 sessao(oes) correlacionadas; lookup por prefixo user/session.

## Acoes do Dia
- Negativar ou revisar termos suspeitos no Google Ads: crm imobiliário gratuito, crm software.
- Revisar fila automatica do Hotjar: prova vista sem CTA nem cadastro (2), signup_completed sem trial ativado (1); a leitura visual continua obrigatoria.

## Backend
- total de touchpoints: 722
- funil curto: cta_click=22, signup_started=10, signup_completed=10

## Google Ads
- 23849461361 | Imovex | Search | Imobiliaria | CRM WhatsApp | status=ENABLED | 7d clicks=82 | 7d conversions=6 | 7d cost=R$ 731.63
- 23853971002 | Imovex | Search | Corretor Solo | CRM Carteira | status=PAUSED | 7d clicks=0 | 7d conversions=0 | 7d cost=R$ 0.00
- 23873069498 | Imovex | Search | Imobiliaria | Bot WhatsApp | status=PAUSED | 7d clicks=15 | 7d conversions=0 | 7d cost=R$ 121.48
- termos suspeitos: crm imobiliário gratuito, crm software

## GA4
- propertyId: 538032834
- sessions: 211
- engagedSessions: 112
- engagementRate: 53%
- eventos lidos: page_view=1194, lp_view=141, cta_click=24, proof_section_view=21, signup_started=17, proof_tour_step_viewed=11, proof_cta_click=8, proof_tour_opened=8, signup_completed=5, trial_crm_first_activated=5, proof_tour_closed=3, auth_form_started=2, auth_google_started=1

## Hotjar
- A API oficial atual do Hotjar nao entrega feed de recordings/heatmaps para este ritual; manter revisao manual de 3 a 5 gravacoes. Fila automatica montada com 3 caso(s) priorizado(s) a partir de 7 sessao(oes) correlacionadas no backend.
- siteId: 6712783
- correlacao automatica: 7 sessoes, 4 touchpoints e 8 conversoes com metadados Hotjar nos itens recentes
- fila automatica de revisao:
  - high | prova vista sem CTA nem cadastro | lookup=user:748e4659 | session:22326a6a | anon:1da2886e | site:6712783 | source=public_track | path=/atendimento-imobiliario-com-ia?utm_source=google&utm_medium=cpc&utm_campaign=imovex_imobiliaria_search&utm_content=software_imobiliario&gad_source=1&gad_campaignid=23849461361&gbraid=0AAAAA-hIse8EaRsMXySaSbV-FVWqziKg7&gclid=Cj0KCQjww8rQBhDjARIsAE43KPNvpjNfs7A4ce-AGlJSmaFhVFHLE7Z1QeJBFzp_MJmiJIPVw0wVpFYaArLOEALw_wcB | at=2026-05-24T22:51:22.788+00:00 | trilha=page_view -> lp_view -> proof_section_view
  - high | prova vista sem CTA nem cadastro | lookup=user:748e4659 | session:9a8e7605 | anon:1da2886e | site:6712783 | source=public_track | path=/atendimento-imobiliario-com-ia?utm_source=google&utm_medium=cpc&utm_campaign=imovex_imobiliaria_search&utm_content=sistema_imobiliaria&gad_source=1&gad_campaignid=23849461361&gbraid=0AAAAA-hIse8EaRsMXySaSbV-FVWqziKg7&gclid=Cj0KCQjww8rQBhDjARIsAE43KPPYw3JzAH2dHuoq7IT9oyLD0Wu90-jQhxSLRcMULA7w0ih3x866eQAaAm-GEALw_wcB | at=2026-05-24T22:16:07.152+00:00 | trilha=page_view -> lp_view -> proof_section_view
  - medium | signup_completed sem trial ativado | lookup=user:ac891546 | session:37ccdd83 | anon:04e45f80 | site:6712783 | source=auth_register | path=n/d | at=2026-05-23T21:14:27.081622+00:00 | trilha=signup_completed
