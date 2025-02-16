import { Injectable } from '@nestjs/common'

import { UserPermissionRepository } from '../../../shared/repositories'
import { GetPermissionsQuery } from './get-permissions.query'

import { Handler } from '@modules/shared/models'

@Injectable()
export class GetPermissionsHandler implements Handler<GetPermissionsQuery, string[]> {
  constructor(private readonly userPermissionRepository: UserPermissionRepository) {}

  async handle(query: GetPermissionsQuery): Promise<string[]> {
    return this.userPermissionRepository
      .getByUserId(query.userId)
      .then((userPermissions) => userPermissions.permissions)
  }
}
