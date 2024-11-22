import { UserRepository } from './repositories'
import { UserCommandService, UserQueryService } from './service'
import { CreateUserValidator } from './validators'

import { CoreContainer } from '@core/core.container'
import { BaseContainer } from '@core/base'

export class UserContainer extends BaseContainer {
  static getUserCommandService(): UserCommandService {
    return this.getInstance(
      UserCommandService,
      () =>
        new UserCommandService(
          this.getCreateUserValidator(),
          CoreContainer.getCryptoService(),
          this.getUserRepository(),
        ),
    )
  }

  static getUserQueryService(): UserQueryService {
    return this.getInstance(UserQueryService, () => new UserQueryService(this.getUserRepository()))
  }

  static getCreateUserValidator(): CreateUserValidator {
    return this.getInstance(CreateUserValidator, () => new CreateUserValidator(this.getUserRepository()))
  }

  static getUserRepository(): UserRepository {
    return this.getInstance(UserRepository, () => new UserRepository())
  }
}
