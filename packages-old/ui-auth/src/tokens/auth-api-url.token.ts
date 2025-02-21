import { InjectionToken, inject } from '@angular/core'

export const AUTH_API_URL = new InjectionToken<string>('authApiUrl')

export const injectAuthApiUrl = (): string => inject<string>(AUTH_API_URL)
