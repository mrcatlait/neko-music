import { Global, Module } from '@nestjs/common'

import { UserProfileRepository } from './repositories'
import { CreateUserProfileUseCase, GetUserProfileUseCase } from './use-cases'

@Global()
@Module({
  providers: [
    // Use cases
    CreateUserProfileUseCase,
    GetUserProfileUseCase,
    // Repositories
    UserProfileRepository,
  ],
  exports: [CreateUserProfileUseCase, GetUserProfileUseCase],
})
export class UserModule {}
