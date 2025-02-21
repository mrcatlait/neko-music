import { Global, Module } from '@nestjs/common'

import { CreateAccountHandler, DeleteAccountHandler } from './commands'
import { GetAccountHandler } from './queries'
import { UserAccountRepository } from './repositories'

@Global()
@Module({
  providers: [
    // Commands
    CreateAccountHandler,
    DeleteAccountHandler,
    // Queries
    GetAccountHandler,
    // Repositories
    UserAccountRepository,
  ],
  exports: [CreateAccountHandler, GetAccountHandler, DeleteAccountHandler],
})
export class UserModule {}
