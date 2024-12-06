import { makeEnvironmentProviders, EnvironmentProviders } from '@angular/core'

import { ENVIRONMENT, Environment } from '../tokens'

export const provideEnvironment = (environment: Environment): EnvironmentProviders =>
  makeEnvironmentProviders([{ provide: ENVIRONMENT, useValue: environment }])
