import { AuthorizationQueryService } from './services'
import { RoleRepository } from './repositories'

import { BaseContainer } from '@core/base'

export class AuthorizationContainer extends BaseContainer {
  static getAuthorizationQueryService(): AuthorizationQueryService {
    return this.getInstance(AuthorizationQueryService, () => new AuthorizationQueryService(this.getRoleRepository()))
  }

  static getRoleRepository(): RoleRepository {
    return this.getInstance(RoleRepository, () => new RoleRepository())
  }
}
