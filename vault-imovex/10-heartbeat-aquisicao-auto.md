# Heartbeat de Aquisicao Auto

> Arquivo auto-gerado. Nao editar manualmente.
> Gerado em 2026-06-10T14:31:27.405Z para o snapshot local 2026-06-10.

Status geral: degraded
Janela: ultimos 7 dias

## Resumo
- Backend: 27 lp_view, 6 auth_view, 1 proof_section_view, 1 cta_click, 1 signup_started, 1 signup_completed nos ultimos 7 dias.
- Google Ads: 5 campanha(s) no filtro Imovex, 0 clique(s) e 0 conversao(oes) em 7 dias.
- GA4: 33 sessions, 13 engagedSessions e engagementRate 39%.
- Hotjar: fila automatica com 2 caso(s) priorizado(s) em 2 sessao(oes) correlacionadas; lookup por prefixo user/session.

## Acoes do Dia
- Ajustar LP: pouco trafego chega na prova do produto em relacao ao volume de lp_view.
- Revisar fila automatica do Hotjar: prova vista sem CTA nem cadastro (1), signup_completed sem trial ativado (1); a leitura visual continua obrigatoria.

## Backend
- total de touchpoints: 77
- funil curto: cta_click=1, signup_started=1, signup_completed=1

## Google Ads
- 23849461361 | Imovex | Search | Imobiliaria | CRM WhatsApp | status=PAUSED | 7d clicks=0 | 7d conversions=0 | 7d cost=R$ 0.00
- 23853971002 | Imovex | Search | Corretor Solo | CRM Carteira | status=PAUSED | 7d clicks=0 | 7d conversions=0 | 7d cost=R$ 0.00
- 23873069498 | Imovex | Search | Imobiliaria | Bot WhatsApp | status=PAUSED | 7d clicks=0 | 7d conversions=0 | 7d cost=R$ 0.00
- 23879898401 | Imovex | Video | RMKT | Imobiliaria | Ate 1 lead | status=ENABLED | 7d clicks=0 | 7d conversions=0 | 7d cost=R$ 0.00
- 23890353730 | Imovex | Search | Imobiliaria | CRM Gratuito | status=PAUSED | 7d clicks=0 | 7d conversions=0 | 7d cost=R$ 0.00

## GA4
- propertyId: 538032834
- sessions: 33
- engagedSessions: 13
- engagementRate: 39%
- eventos lidos: page_view=77, lp_view=14, auth_form_started=3, account_completion_completed=1, account_completion_started=1, account_completion_view=1, auth_company_deferred=1, auth_google_started=1, cta_click=1, proof_section_view=1, signup_completed=1, signup_started=1

## Hotjar
- A API oficial atual do Hotjar nao entrega feed de recordings/heatmaps para este ritual; manter revisao manual de 3 a 5 gravacoes. Fila automatica montada com 2 caso(s) priorizado(s) a partir de 2 sessao(oes) correlacionadas no backend.
- siteId: 6712783
- correlacao automatica: 2 sessoes, 1 touchpoints e 3 conversoes com metadados Hotjar nos itens recentes
- fila automatica de revisao:
  - high | prova vista sem CTA nem cadastro | lookup=user:09a79275 | session:bb0bf17d | anon:f6e3703d | site:6712783 | source=public_track | path=/atendimento-imobiliario-com-ia | at=2026-06-09T02:07:06.584+00:00 | trilha=lp_view -> proof_section_view
  - medium | signup_completed sem trial ativado | lookup=user:f50b61f0 | session:623ba27e | anon:80a5ee20 | site:6712783 | source=auth_register | path=n/d | at=2026-06-05T21:34:52.806+00:00 | trilha=cta_click -> signup_started -> signup_completed
