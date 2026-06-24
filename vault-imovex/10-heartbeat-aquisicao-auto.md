# Heartbeat de Aquisicao Auto

> Arquivo auto-gerado. Nao editar manualmente.
> Gerado em 2026-06-24T13:31:40.913Z para o snapshot local 2026-06-24.

Status geral: degraded
Janela: ultimos 7 dias

## Resumo
- Backend: 10 lp_view, 0 auth_view, 1 proof_section_view, 0 cta_click, 0 signup_started, 0 signup_completed nos ultimos 7 dias.
- Google Ads: 5 campanha(s) no filtro Imovex, 0 clique(s) e 0 conversao(oes) em 7 dias.
- GA4: 10 sessions, 2 engagedSessions e engagementRate 20%.
- Hotjar: fila automatica com 2 caso(s) priorizado(s) em 2 sessao(oes) correlacionadas; lookup por prefixo user/session.

## Acoes do Dia
- Ajustar LP: existe visita suficiente, mas a CTA principal ainda nao esta convertendo em clique.
- Ajustar LP: pouco trafego chega na prova do produto em relacao ao volume de lp_view.
- Revisar fila automatica do Hotjar: lp_view sem chegar na prova (1), prova vista sem CTA nem cadastro (1); a leitura visual continua obrigatoria.

## Backend
- total de touchpoints: 21
- funil curto: cta_click=0, signup_started=0, signup_completed=0

## Google Ads
- 23849461361 | Imovex | Search | Imobiliaria | CRM WhatsApp | status=PAUSED | 7d clicks=0 | 7d conversions=0 | 7d cost=R$ 0.00
- 23853971002 | Imovex | Search | Corretor Solo | CRM Carteira | status=PAUSED | 7d clicks=0 | 7d conversions=0 | 7d cost=R$ 0.00
- 23873069498 | Imovex | Search | Imobiliaria | Bot WhatsApp | status=PAUSED | 7d clicks=0 | 7d conversions=0 | 7d cost=R$ 0.00
- 23879898401 | Imovex | Video | RMKT | Imobiliaria | Ate 1 lead | status=ENABLED | 7d clicks=0 | 7d conversions=0 | 7d cost=R$ 0.00
- 23890353730 | Imovex | Search | Imobiliaria | CRM Gratuito | status=PAUSED | 7d clicks=0 | 7d conversions=0 | 7d cost=R$ 0.00

## GA4
- propertyId: 538032834
- sessions: 10
- engagedSessions: 2
- engagementRate: 20%
- eventos lidos: lp_view=9, page_view=9, proof_section_view=1

## Hotjar
- A API oficial atual do Hotjar nao entrega feed de recordings/heatmaps para este ritual; manter revisao manual de 3 a 5 gravacoes. Fila automatica montada com 2 caso(s) priorizado(s) a partir de 2 sessao(oes) correlacionadas no backend.
- siteId: 6712783
- correlacao automatica: 2 sessoes, 3 touchpoints e 0 conversoes com metadados Hotjar nos itens recentes
- fila automatica de revisao:
  - high | prova vista sem CTA nem cadastro | lookup=user:0ec68e96 | session:83ebf6b7 | anon:90b17640 | site:6712783 | source=public_track | path=/atendimento-imobiliario-com-ia | at=2026-06-23T18:27:31.292+00:00 | trilha=page_view -> lp_view -> proof_section_view
  - medium | lp_view sem chegar na prova | lookup=user:2b9ece57 | anon:9e69a5d6 | site:6712783 | source=public_track | path=/atendimento-imobiliario-com-ia | at=2026-06-23T14:35:27.02+00:00 | trilha=page_view -> lp_view
