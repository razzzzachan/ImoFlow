import { CreateLeadData, Lead } from '../../domain/entities/Lead'
import { CRMRepository } from '../../infra/repositories/CRMRepository'

export class CreateLeadUseCase {
  constructor(private repo: CRMRepository) {}

  async execute(input: CreateLeadData & { createdBy: string }): Promise<Lead> {
    const lead: Lead = await this.repo.createLead(input, input.createdBy)
    return lead
  }
}

