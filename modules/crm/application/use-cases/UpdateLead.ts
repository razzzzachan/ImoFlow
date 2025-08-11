import { Lead, UpdateLeadData } from '../../domain/entities/Lead'
import { CRMRepository } from '../../infra/repositories/CRMRepository'

export class UpdateLeadUseCase {
  constructor(private repo: CRMRepository) {}

  async execute(id: string, data: UpdateLeadData, updatedBy: string): Promise<Lead> {
    return this.repo.updateLead(id, data, updatedBy)
  }
}

