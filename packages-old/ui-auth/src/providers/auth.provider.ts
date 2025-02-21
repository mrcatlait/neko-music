import { EnvironmentProviders, inject, provideAppInitializer, Provider } from '@angular/core'

import { SessionCookieService } from '../services'
import { AuthSessionState, AuthStatusState } from '../states'
import { CredentialsAuthStrategy, SilentAuthStrategy } from '../strategies'
import { AUTH_API_URL } from '../tokens'
import { AuthRepository } from '../repositories'
import { AuthFacade } from '../auth.facade'
interface AuthConfig {
  apiUrl: string
}

export const provideAuth = (config: AuthConfig): (Provider | EnvironmentProviders)[] => {
  return [
    provideAppInitializer(() => inject(AuthFacade).silentLogin()),
    SessionCookieService,
    AuthSessionState,
    AuthStatusState,
    CredentialsAuthStrategy,
    SilentAuthStrategy,
    AuthRepository,
    AuthFacade,
    {
      provide: AUTH_API_URL,
      useValue: config.apiUrl,
    },
  ]
}
