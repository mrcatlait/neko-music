import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core'
import { PreloadAllModules, provideRouter, withComponentInputBinding, withPreloading } from '@angular/router'
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http'
import { provideSignalFormsConfig } from '@angular/forms/signals'
import { NG_STATUS_CLASSES } from '@angular/forms/signals/compat'

import { routes } from './app.routes'

import { SilentAuthStrategy } from '@/core/auth/strategies'
import { provideDialogs } from '@/shared/dialog'
import { provideEnvironment, provideArtworkLoader } from '@/core/providers'
import { jwtInterceptor } from '@/core/auth/interceptors'
import { environment } from '@/environment'

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch(), withInterceptors([jwtInterceptor])),
    provideZonelessChangeDetection(),
    provideRouter(routes, withPreloading(PreloadAllModules), withComponentInputBinding()),
    provideEnvironment(environment),
    provideArtworkLoader(environment.mediaUrl),
    provideAppInitializer(() => inject(SilentAuthStrategy).authenticate()),
    provideDialogs(),
    provideSignalFormsConfig({
      classes: NG_STATUS_CLASSES,
    }),
  ],
}
