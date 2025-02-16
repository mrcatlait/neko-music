import { Global, Module } from '@nestjs/common'

import { UserAccountRepository } from './shared/repositories'
import { GetAccountHandler } from './account/queries'
import { CreateAccountHandler } from './account/commands'

@Global()
@Module({
  providers: [CreateAccountHandler, GetAccountHandler, UserAccountRepository],
  exports: [CreateAccountHandler, GetAccountHandler],
})
export class UserModule {}
