import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core'
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router'
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http'

import { routes } from './app.routes'
import { SilentAuthStrategy } from './core/strategies'

import { provideEnvironment } from '@/core/providers'
import { jwtInterceptor } from '@/core/interceptors'
import { environment } from '@/environment'

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch(), withInterceptors([jwtInterceptor])),
    provideZonelessChangeDetection(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideEnvironment(environment),
    provideAppInitializer(() => inject(SilentAuthStrategy).authenticate()),
  ],
}
