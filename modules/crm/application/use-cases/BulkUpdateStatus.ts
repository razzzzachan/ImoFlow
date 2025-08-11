import { CRMRepository } from '../../infra/repositories/CRMRepository'

export class BulkUpdateStatusUseCase {
  constructor(private repo: CRMRepository) {}

  async execute(leadIds: string[], newStatus: string, updatedBy: string, reason?: string) {
    return this.repo.bulkUpdateStatus(leadIds, newStatus, updatedBy, reason)
  }
}

