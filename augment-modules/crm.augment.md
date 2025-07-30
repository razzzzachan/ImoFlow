# crm.augment.md

## Objetivo
Centralizar e organizar o fluxo de leads captados pelos bots e canais manuais.

## Entidades
- Lead: nome, telefone, origem, status, responsável, observações
- Funil: etapas (captado, em atendimento, visita marcada, fechado, perdido)

## Funcionalidades
- Visualização em Kanban por status
- Filtros por corretor, origem e data
- Histórico de interações (mensagem, ligação, nota interna)
- Categorização automática de leads via bots

## Tarefas
- [ ] Criar modelo Lead e Funil no banco
- [ ] Endpoints CRUD de leads
- [ ] Interface de CRM com filtros e edição inline
- [ ] Integração com módulo de bots para entrada automática de leads

## Conexões
- Bots: criam leads automaticamente
- Auth: cada lead tem um responsável
