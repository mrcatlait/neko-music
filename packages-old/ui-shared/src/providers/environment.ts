import { EnvironmentProviders, inject, InjectionToken, makeEnvironmentProviders } from '@angular/core'

import { Environment } from '../interfaces/index'

export const ENVIRONMENT = new InjectionToken<Environment>('ENVIRONMENT')

export const provideEnvironment = (environment: Environment): EnvironmentProviders =>
  makeEnvironmentProviders([{ provide: ENVIRONMENT, useValue: environment }])

export const injectEnvironment = <T extends Environment>(): T => inject<T>(ENVIRONMENT)