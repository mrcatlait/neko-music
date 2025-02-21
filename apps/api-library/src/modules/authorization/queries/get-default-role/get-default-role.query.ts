import { Query } from '@nestjs/cqrs'

import { RoleEntity } from '@modules/authorization/entities'

export class GetDefaultRoleQuery extends Query<RoleEntity> {
  constructor() {
    super()
  }
}
