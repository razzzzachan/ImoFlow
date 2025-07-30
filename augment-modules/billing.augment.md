# billing.augment.md

## Objetivo
Controlar cobrança, créditos e consumo do sistema SaaS.

## Modelos de Cobrança
- Taxa de Implementação (setup inicial)
- Planos mensais: Básico, Pro, Avançado
- Cobrança por tokens: mensagens, voz, OCR, requisições externas

## Funcionalidades
- Controle de planos ativos
- Cobrança automatizada via API (Stripe ou Gerencianet)
- Tabela de tokens por tipo de requisição
- Controle de saldo e recarga manual
- Relatório de uso mensal

## Tarefas
- [ ] Criar tabela de planos
- [ ] Criar tabela de consumo (tipo, quantidade, custo)
- [ ] Tabela de créditos e histórico de recarga
- [ ] Webhooks de pagamento (ex: Stripe)
- [ ] Endpoint de consulta de saldo e plano ativo
- [ ] Integração com bots para débito automático de tokens por uso
