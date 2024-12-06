import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core'

import { AuthService, SessionStorageService, SessionCookieService } from '../services'
import { AuthRepository } from '../repositories'

export const provideAuth = (): EnvironmentProviders =>
  makeEnvironmentProviders([AuthRepository, AuthService, SessionStorageService, SessionCookieService])
