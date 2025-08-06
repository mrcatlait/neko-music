import { Injectable, UnauthorizedException } from '@nestjs/common'

import { AssignRoleValidator } from './assign-role.validator'
import { UserRoleRepository } from '../../repositories'

export interface AssignRoleUseCaseParams {
  readonly userId: string
  readonly roleId: string
}

@Injectable()
export class AssignRoleUseCase {
  constructor(
    private readonly userRoleRepository: UserRoleRepository,
    private readonly assignRoleValidator: AssignRoleValidator,
  ) {}

  async invoke(params: AssignRoleUseCaseParams): Promise<void> {
    const validationResult = await this.assignRoleValidator.validate(params)

    if (!validationResult.isValid) {
      throw new UnauthorizedException()
    }

    await this.userRoleRepository.create({
      userId: params.userId,
      roleId: params.roleId,
    })
  }
}
