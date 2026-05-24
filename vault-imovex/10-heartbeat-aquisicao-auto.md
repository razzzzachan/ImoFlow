# Heartbeat de Aquisicao Auto

> Arquivo auto-gerado. Nao editar manualmente.
> Gerado em 2026-05-24T12:13:49.040Z para o snapshot local 2026-05-24.

Status geral: degraded
Janela: ultimos 7 dias

## Resumo
- Backend: 183 lp_view, 84 auth_view, 26 proof_section_view, 20 cta_click, 9 signup_started, 9 signup_completed nos ultimos 7 dias.
- Google Ads: 3 campanha(s) no filtro Imovex, 79 clique(s) e 5 conversao(oes) em 7 dias.
- Google Ads: termos suspeitos ainda visiveis: crm imobiliário gratuito, crm software.
- GA4: 200 sessions, 90 engagedSessions e engagementRate 45%.
- Hotjar: fila automatica com 1 caso(s) priorizado(s) em 3 sessao(oes) correlacionadas; lookup por prefixo user/session.

## Acoes do Dia
- Ajustar LP: pouco trafego chega na prova do produto em relacao ao volume de lp_view.
- Negativar ou revisar termos suspeitos no Google Ads: crm imobiliário gratuito, crm software.
- Revisar fila automatica do Hotjar: signup_completed sem trial ativado (1); a leitura visual continua obrigatoria.

## Backend
- total de touchpoints: 673
- funil curto: cta_click=20, signup_started=9, signup_completed=9

## Google Ads
- 23849461361 | Imovex | Search | Imobiliaria | CRM WhatsApp | status=ENABLED | 7d clicks=72 | 7d conversions=5 | 7d cost=R$ 612.72
- 23853971002 | Imovex | Search | Corretor Solo | CRM Carteira | status=PAUSED | 7d clicks=0 | 7d conversions=0 | 7d cost=R$ 0.00
- 23873069498 | Imovex | Search | Imobiliaria | Bot WhatsApp | status=ENABLED | 7d clicks=7 | 7d conversions=0 | 7d cost=R$ 62.77
- termos suspeitos: crm imobiliário gratuito, crm software

## GA4
- propertyId: 538032834
- sessions: 200
- engagedSessions: 90
- engagementRate: 45%
- eventos lidos: page_view=1095, lp_view=134, cta_click=23, proof_section_view=18, signup_started=17, proof_tour_step_viewed=11, proof_cta_click=8, proof_tour_opened=8, signup_completed=4, trial_crm_first_activated=4, proof_tour_closed=3

## Hotjar
- A API oficial atual do Hotjar nao entrega feed de recordings/heatmaps para este ritual; manter revisao manual de 3 a 5 gravacoes. Fila automatica montada com 1 caso(s) priorizado(s) a partir de 3 sessao(oes) correlacionadas no backend.
- siteId: 6712783
- correlacao automatica: 3 sessoes, 0 touchpoints e 6 conversoes com metadados Hotjar nos itens recentes
- fila automatica de revisao:
  - medium | signup_completed sem trial ativado | lookup=user:ac891546 | session:37ccdd83 | anon:04e45f80 | site:6712783 | source=auth_register | path=n/d | at=2026-05-23T21:14:27.081622+00:00 | trilha=cta_click -> signup_started -> signup_completed
