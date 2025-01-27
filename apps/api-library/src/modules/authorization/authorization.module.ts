import { Global, Module } from '@nestjs/common'

import { GetDefaultRoleHandler } from './roles/queries'
import { RoleRepository } from './shared/repositories'

@Global()
@Module({
  providers: [GetDefaultRoleHandler, RoleRepository],
  exports: [GetDefaultRoleHandler],
})
export class AuthorizationModule {}
