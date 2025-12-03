import { Global, Module } from '@nestjs/common'

import { UserRepository } from './repositories'
import { CreateUserProfileUseCase, GetUserProfileUseCase } from './use-cases'

@Global()
@Module({
  providers: [
    // Use cases
    CreateUserProfileUseCase,
    GetUserProfileUseCase,
    // Repositories
    UserRepository,
  ],
  exports: [CreateUserProfileUseCase, GetUserProfileUseCase],
})
export class UserModule {}
