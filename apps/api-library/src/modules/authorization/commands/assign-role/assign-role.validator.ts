import { Injectable } from '@nestjs/common'

import { RoleRepository } from '@modules/authorization/repositories'
import { ValidationResult, Validator } from '@modules/shared/models'

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
