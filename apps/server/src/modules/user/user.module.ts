import { Global, Module } from '@nestjs/common'

import { UserAccountRepository } from './shared/repositories'
import { GetAccountHandler } from './account/queries'
import { CreateAccountHandler, DeleteAccountHandler } from './account/commands'

@Global()
@Module({
  providers: [CreateAccountHandler, GetAccountHandler, UserAccountRepository, DeleteAccountHandler],
  exports: [CreateAccountHandler, GetAccountHandler, DeleteAccountHandler],
})
export class UserModule {}
