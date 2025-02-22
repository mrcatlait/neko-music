import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'

import { GetPermissionsQuery } from './get-permissions.query'

import { UserPermissionRepository } from '@modules/authorization/repositories'

@QueryHandler(GetPermissionsQuery)
export class GetPermissionsHandler implements IQueryHandler<GetPermissionsQuery> {
  constructor(private readonly userPermissionRepository: UserPermissionRepository) {}

  async execute(query: GetPermissionsQuery): Promise<string[]> {
    return this.userPermissionRepository.findOne(query.userId).then((userPermissions) => userPermissions.permissions)
  }
}
