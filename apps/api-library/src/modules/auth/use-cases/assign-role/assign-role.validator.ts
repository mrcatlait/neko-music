import { Injectable } from '@nestjs/common'

import { RoleRepository } from '../../repositories'
import { AssignRoleUseCaseParams } from './assign-role.use-case'

import { ValidationResult, Validator } from '@modules/shared/models'

@Injectable()
export class AssignRoleValidator implements Validator<AssignRoleUseCaseParams> {
  constructor(private readonly roleRepository: RoleRepository) {}

  async validate(params: AssignRoleUseCaseParams): Promise<ValidationResult> {
    const isValid = await this.roleRepository.exists(params.roleId)

    return {
      isValid,
      errors: isValid ? [] : ['Role not found'],
    }
  }
}
