# Heartbeat de Aquisicao Auto

> Arquivo auto-gerado. Nao editar manualmente.
> Gerado em 2026-05-28T14:50:42.011Z para o snapshot local 2026-05-28.

Status geral: degraded
Janela: ultimos 7 dias

## Resumo
- Backend: 167 lp_view, 111 auth_view, 30 proof_section_view, 18 cta_click, 3 signup_started, 5 signup_completed nos ultimos 7 dias.
- Google Ads: 5 campanha(s) no filtro Imovex, 87 clique(s) e 6 conversao(oes) em 7 dias.
- Google Ads: termos suspeitos ainda visiveis: crm imobiliário gratuito, sisdea.
- GA4: 165 sessions, 96 engagedSessions e engagementRate 58%.
- Hotjar: fila automatica com 2 caso(s) priorizado(s) em 8 sessao(oes) correlacionadas; lookup por prefixo user/session.

## Acoes do Dia
- Negativar ou revisar termos suspeitos no Google Ads: crm imobiliário gratuito, sisdea.
- Revisar fila automatica do Hotjar: prova vista sem CTA nem cadastro (1), signup_completed sem trial ativado (1); a leitura visual continua obrigatoria.

## Backend
- total de touchpoints: 675
- funil curto: cta_click=18, signup_started=3, signup_completed=5

## Google Ads
- 23849461361 | Imovex | Search | Imobiliaria | CRM WhatsApp | status=ENABLED | 7d clicks=72 | 7d conversions=6 | 7d cost=R$ 558.43
- 23853971002 | Imovex | Search | Corretor Solo | CRM Carteira | status=PAUSED | 7d clicks=0 | 7d conversions=0 | 7d cost=R$ 0.00
- 23873069498 | Imovex | Search | Imobiliaria | Bot WhatsApp | status=PAUSED | 7d clicks=15 | 7d conversions=0 | 7d cost=R$ 121.48
- 23879898401 | Imovex | Video | RMKT | Imobiliaria | Ate 1 lead | status=ENABLED | 7d clicks=0 | 7d conversions=0 | 7d cost=R$ 0.00
- 23890353730 | Imovex | Search | Imobiliaria | CRM Gratuito | status=PAUSED | 7d clicks=0 | 7d conversions=0 | 7d cost=R$ 0.00
- termos suspeitos: crm imobiliário gratuito, sisdea

## GA4
- propertyId: 538032834
- sessions: 165
- engagedSessions: 96
- engagementRate: 58%
- eventos lidos: page_view=862, lp_view=103, proof_tour_step_viewed=18, cta_click=16, proof_section_view=15, proof_cta_click=13, proof_tour_opened=13, signup_started=8, auth_google_started=6, proof_tour_closed=4, auth_form_started=3, signup_completed=3, trial_crm_first_activated=3, account_completion_completed=2, account_completion_started=2, account_completion_view=2, auth_company_deferred=2

## Hotjar
- A API oficial atual do Hotjar nao entrega feed de recordings/heatmaps para este ritual; manter revisao manual de 3 a 5 gravacoes. Fila automatica montada com 2 caso(s) priorizado(s) a partir de 8 sessao(oes) correlacionadas no backend.
- siteId: 6712783
- correlacao automatica: 8 sessoes, 5 touchpoints e 8 conversoes com metadados Hotjar nos itens recentes
- fila automatica de revisao:
  - high | prova vista sem CTA nem cadastro | lookup=user:ac891546 | session:536a8939 | anon:dfabeb55 | site:6712783 | source=public_track | path=/atendimento-imobiliario-com-ia?utm_source=google&utm_medium=video&utm_campaign=imovex_imobiliaria_youtube_rmkt_ate_1_lead&utm_content=prova_sem_auth_14d | at=2026-05-28T12:58:46.458+00:00 | trilha=page_view -> lp_view -> proof_section_view
  - medium | signup_completed sem trial ativado | lookup=user:6dfd9b9f | session:8a44c8b1 | anon:ea3fb9a5 | site:6712783 | source=auth_register | path=n/d | at=2026-05-27T22:04:35.066416+00:00 | trilha=cta_click -> signup_started -> signup_completed
