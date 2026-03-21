import { Injectable } from '@nestjs/common'
import { Role } from '@neko/permissions'

import { AuthRepository } from '../../repositories'

import { UseCase } from '@/modules/shared/types'

export interface UpdateRoleUseCaseParams {
  readonly userId: string
  readonly role: Role
}

@Injectable()
export class UpdateRoleUseCase implements UseCase<UpdateRoleUseCaseParams, void> {
  constructor(private readonly authRepository: AuthRepository) {}

  invoke(params: UpdateRoleUseCaseParams): Promise<void> {
    return this.authRepository.updateRoleByUserId(params.userId, params.role)
  }
}
