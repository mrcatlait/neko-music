import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders } from '@angular/core'

interface AuthOptions {
  passcodeAuth: boolean
  passwordAuth: boolean
  social: {
    google: boolean
    github: boolean
  }
}

export const AUTH_OPTIONS = new InjectionToken<AuthOptions>('AUTH_OPTIONS')

export const provideAuth = (options: Partial<AuthOptions> = {}): EnvironmentProviders =>
  makeEnvironmentProviders([{ provide: AUTH_OPTIONS, useValue: options }])
