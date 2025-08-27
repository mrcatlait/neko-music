import {
  ApplicationConfig,
  DOCUMENT,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core'
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router'
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http'

import { routes } from './app.routes'

import { provideEnvironment, WINDOW, windowProvider } from '@/core/providers'
import { credentialsInterceptor } from '@/shared/interceptors'
import { environment } from '@/environment'

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch(), withInterceptors([credentialsInterceptor])),
    provideZonelessChangeDetection(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideEnvironment(environment),
    {
      provide: WINDOW,
      useFactory: (document: Document) => windowProvider(document),
      deps: [DOCUMENT],
    },
  ],
}
