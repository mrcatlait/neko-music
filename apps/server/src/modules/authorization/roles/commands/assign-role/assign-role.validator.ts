import { Injectable } from '@nestjs/common'

import { ValidationResult, Validator } from '@modules/shared/models'
import { RoleRepository } from '@modules/authorization/shared/repositories'

export interface AssignRoleValidatorPayload {
  userId: string
  roleId: string
}

@Injectable()
export class AssignRoleValidator implements Validator<AssignRoleValidatorPayload> {
  constructor(private readonly roleRepository: RoleRepository) {}

  async validate(payload: AssignRoleValidatorPayload): Promise<ValidationResult> {
    const isValid = await this.roleRepository.existsById(payload.roleId)

    return {
      isValid,
      errors: isValid ? [] : ['Role not found'],
    }
  }
}
