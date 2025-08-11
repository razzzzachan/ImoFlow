import client from 'prom-client'

export const registry = client.register

// Função para criar métricas de forma segura (evita duplicação)
function createMetricSafely<T extends client.Metric<any>>(
  metricFactory: () => T,
  name: string
): T {
  try {
    return metricFactory()
  } catch (error: any) {
    if (error.message?.includes('already been registered')) {
      // Retorna a métrica existente
      return registry.getSingleMetric(name) as T
    }
    throw error
  }
}

export const leadsCreatedCounter = createMetricSafely(
  () => new client.Counter({
    name: 'crm_leads_created_total',
    help: 'Total de leads criados'
  }),
  'crm_leads_created_total'
)

export const statusChangesCounter = createMetricSafely(
  () => new client.Counter({
    name: 'crm_status_changes_total',
    help: 'Total de mudanças de status em leads',
    labelNames: ['status_to'] as const
  }),
  'crm_status_changes_total'
)

export const assignmentsCounter = createMetricSafely(
  () => new client.Counter({
    name: 'crm_assignments_total',
    help: 'Total de atribuições de leads a usuários'
  }),
  'crm_assignments_total'
)

export const errorsCounter = createMetricSafely(
  () => new client.Counter({
    name: 'crm_errors_total',
    help: 'Total de erros em operações do CRM'
  }),
  'crm_errors_total'
)

