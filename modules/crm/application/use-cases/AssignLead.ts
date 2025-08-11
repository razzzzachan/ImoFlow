import { Lead } from '../../domain/entities/Lead'
import { CRMRepository } from '../../infra/repositories/CRMRepository'

export class AssignLeadUseCase {
  constructor(private repo: CRMRepository) {}

  async execute(id: string, assignedTo: string, assignedBy: string): Promise<Lead> {
    return this.repo.assignLead(id, assignedTo, assignedBy)
  }
}

