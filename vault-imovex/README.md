# Vault Imovex

Este vault e a base operacional para GTM, LP, ICP, copy e Google Ads do Imovex.

## Quando consultar primeiro

- antes de mudar copy de landing page;
- antes de criar ou ajustar campanha paga;
- antes de mudar CTA, oferta ou promessa comercial;
- antes de decidir entre foco em imobiliaria ou corretor autonomo;
- antes de usar API do Google Ads neste projeto.

## Ordem de leitura recomendada

1. `01-posicionamento-e-guardrails.md`
2. `02-icp-lps-e-rotas.md`
3. `03-google-ads-operacao.md`
4. `07-lp-funil-e-leituras-ao-vivo.md`
5. `08-cadencia-operacional-de-aquisicao.md`
6. `09-checklist-diario-de-aquisicao.md`
7. `10-heartbeat-aquisicao-auto.md`
8. `04-google-ads-campaign-blueprints.md`
9. `05-google-ads-api-readiness.md`
10. `06-google-ads-launch-sequence.md`

## Regra operacional

- nao misturar ICPs no mesmo funil pago;
- imobiliaria e o foco principal atual;
- corretor autonomo e trilha secundaria de exploracao;
- a promessa comercial deve respeitar o estado real do produto: CRM first self-serve + WhatsApp a partir do Basico via QR code.
- trafego pago deve preservar UTM e `gclid` ate o login/cadastro.
- leituras de LP, Hotjar, GA4 e backend devem sempre separar trafego e contas de teste antes de concluir bounce, atrito ou qualidade de campanha.
- nao usar `vault-inicial/` como fonte de verdade para GTM, LP, ICP ou Google Ads do Imovex.