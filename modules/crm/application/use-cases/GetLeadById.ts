import { Lead } from '../../domain/entities/Lead'
import { CRMRepository } from '../../infra/repositories/CRMRepository'

export class GetLeadByIdUseCase {
  constructor(private repo: CRMRepository) {}

  async execute(id: string): Promise<Lead> {
    return this.repo.getLeadById(id)
  }
}

