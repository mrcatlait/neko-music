import { AuthenticationCommandService } from './services/authentication-command.service'

import { UserContainer } from '@features/user/user.container'
import { BaseContainer } from '@core/base'
import { CoreContainer } from '@core/core.container'
import { AuthorizationContainer } from '@features/authorization'

export class AuthenticationContainer extends BaseContainer {
  static getAuthenticationCommandService(): AuthenticationCommandService {
    return this.getInstance(
      AuthenticationCommandService,
      () =>
        new AuthenticationCommandService(
          UserContainer.getUserCommandService(),
          UserContainer.getUserQueryService(),
          AuthorizationContainer.getAuthorizationQueryService(),
          CoreContainer.getCryptoService(),
        ),
    )
  }
}
