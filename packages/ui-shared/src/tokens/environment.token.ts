import { InjectionToken, inject } from '@angular/core'

export interface Environment {
  production: boolean
  apiUrl: string
  applicationName: string
}

export const ENVIRONMENT = new InjectionToken<Environment>('environment')

export const injectEnvironment = <T extends Environment>(): T => inject<T>(ENVIRONMENT)
