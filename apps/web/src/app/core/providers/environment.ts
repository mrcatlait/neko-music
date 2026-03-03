import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders } from '@angular/core'

import { Environment } from '@/shared/models'

export const ENVIRONMENT = new InjectionToken<Environment>('ENVIRONMENT')
export const provideEnvironment = (environment: Environment): EnvironmentProviders =>
  makeEnvironmentProviders([{ provide: ENVIRONMENT, useValue: environment }])
