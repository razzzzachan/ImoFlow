# Checklist Diario de Aquisicao

Atualizado em 17/05/2026.

## Objetivo

Executar uma leitura diaria curta do acquisition do Imovex sem virar auditoria longa.

Tempo alvo: 15 a 25 minutos.

O objetivo diario nao e explicar tudo. O objetivo diario e sair com apenas uma destas respostas:

- `manter`
- `negativar`
- `ajustar LP`
- `investigar auth`

## Fontes que entram no ritual

Usar sempre nesta ordem:

1. `10-heartbeat-aquisicao-auto.md` como pre-read do dia
2. Google Ads: campanha ativa, resumo e search terms
3. GA4: propriedade correta do Imovex
4. backend publico: touchpoints e eventos de conversao
5. Hotjar: 3 a 5 gravacoes recentes de paid traffic

## Regra da automacao

- o heartbeat automatico prepara Ads, backend e GA4 quando houver credencial;
- ele nao substitui a leitura manual de gravacoes do Hotjar;
- se o arquivo auto-gerado estiver desatualizado, nao confiar nele como unica base para decisoes de LP.

## Regra zero

Antes de interpretar qualquer dado, excluir trafego e contas de teste:

- `prod_track_e2e`
- `audit_probe`
- `ga_live_check`
- smoke users e emails artificiais
- navegacao interna de verificacao

Se essa limpeza nao for feita, a leitura do dia nao vale.

## Sequencia do ritual

### 1. Ler Ads do dia anterior e de 7 dias

Preencher:

- impressoes
- cliques
- custo
- CTR
- CPC medio
- conversoes
- search terms novos relevantes

Perguntas de decisao:

1. apareceu termo claramente ruim ou fora da dor central?
2. o gasto esta indo para busca curiosa, gratis, comparativa fraca ou fora do ICP?
3. existe termo novo que merece negativa hoje?

Se sim, a saida do dia tende a ser `negativar`.

### 2. Ler o funil curto da landing page

Conferir no GA4 e no backend publico:

- `page_view`
- `lp_view`
- `proof_section_view`
- `cta_click`
- chegada ao `/login`
- `signup_started`
- `signup_blocked_company_required`, se aparecer
- `signup_autologin_failed`, se aparecer

Perguntas de decisao:

1. o clique esta morrendo antes da prova?
2. a prova esta sendo consumida mas quase ninguem clica?
3. o clique chega ao auth mas o cadastro nao anda?

Leitura correta:

- morre antes da prova: problema maior de promessa, hierarquia ou alinhamento LP x termo;
- chega na prova mas nao clica: problema maior de CTA ou prova insuficiente;
- chega no auth e nao anda: problema maior de atrito tecnico ou friccao de cadastro.

### 3. Abrir Hotjar recente de paid traffic

Assistir 3 a 5 sessoes recentes com foco em:

- tempo ate abandonar a LP;
- scroll ate prova ou nao;
- clique em CTA ou nao;
- sinais de confusao no topo da pagina;
- chegada ao auth e travas visiveis.

Perguntas de decisao:

1. a pessoa entende rapido o produto?
2. ela chega a ver prova concreta?
3. ela hesita mais na LP ou no auth?

Se a maioria sai rapido da LP, a saida do dia tende a ser `ajustar LP`.

### 4. Fechar a decisao do dia

Escolher apenas uma saida principal:

- `manter`: nada relevante mudou; observar mais 24h
- `negativar`: houve termo ruim claro ou gasto desalinhado
- `ajustar LP`: o clique continua morrendo antes da prova ou da CTA
- `investigar auth`: o clique chega ao cadastro mas o funil quebra no registro

Se houver mais de um problema, escolher o primeiro ponto de quebra dominante do funil.

## Tabela curta de interpretacao

Use esta leitura para nao cair em diagnostico errado:

- search term ruim + bounce alto: primeiro corrigir Ads
- search term razoavel + bounce alto na LP: primeiro corrigir LP
- clique chega no auth + `signup_started` baixo: primeiro investigar atrito no cadastro
- `signup_started` existe + cadastro final nao aparece: primeiro investigar registro, redirect e backend

## Modelo de registro diario

Preencher assim, sem texto longo:

```md
Data:
Janela lida:

Filtro de teste aplicado:
- sim / nao
- exclusoes usadas:

Ads:
- impressoes:
- cliques:
- custo:
- conversoes:
- termos ruins observados:
- termos bons observados:

Funil:
- lp_view:
- proof_section_view:
- cta_click:
- /login:
- signup_started:
- alertas de auth:

Hotjar:
- sessoes vistas:
- padrao dominante:

Decisao do dia:
- manter / negativar / ajustar LP / investigar auth

Acao pequena de hoje:

Rechecagem amanha:
```

## Regra de disciplina

Se o ritual diario nao termina com uma acao pequena clara ou com `manter`, a leitura ficou ampla demais.

O diario serve para proteger a operacao. A analise profunda fica para a revisao semanal.