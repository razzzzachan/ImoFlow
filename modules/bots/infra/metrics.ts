import client from 'prom-client'

export const registry = client.register

export const botsCreatedCounter = new client.Counter({
  name: 'bots_created_total',
  help: 'Total de bots criados'
})

export const botsFlowsCreatedCounter = new client.Counter({
  name: 'bots_flows_created_total',
  help: 'Total de fluxos de bot criados'
})

export const botsMessagesProcessedCounter = new client.Counter({
  name: 'bots_messages_processed_total',
  help: 'Total de mensagens processadas pelo bot'
})

export const botsErrorsCounter = new client.Counter({
  name: 'bots_errors_total',
  help: 'Total de erros no módulo de bots'
})

registry.registerMetric(botsCreatedCounter)
registry.registerMetric(botsFlowsCreatedCounter)
registry.registerMetric(botsMessagesProcessedCounter)
registry.registerMetric(botsErrorsCounter)

