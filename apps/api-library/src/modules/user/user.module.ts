import { Module } from '@nestjs/common'

import { UserLoginDataRepository, UserRepository } from './repositories'
import { CreateUserHandler, CreateUserValidator } from './commands'

@Module({
  providers: [UserRepository, UserLoginDataRepository, CreateUserValidator, CreateUserHandler],
})
export class UserModule {}
