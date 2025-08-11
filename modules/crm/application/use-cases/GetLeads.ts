import { Lead, LeadFilters } from '../../domain/entities/Lead'
import { CRMRepository } from '../../infra/repositories/CRMRepository'

export class GetLeadsUseCase {
  constructor(private repo: CRMRepository) {}

  async execute(filters: LeadFilters): Promise<{ leads: Lead[]; pagination: any }> {
    return this.repo.getLeads(filters)
  }
}

