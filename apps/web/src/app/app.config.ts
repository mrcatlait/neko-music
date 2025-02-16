import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core'
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router'
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http'
import { DOCUMENT } from '@angular/common'
import { provideAuth } from '@neko/ui-auth'
import { provideEnvironment, WINDOW, windowProvider } from '@neko/ui-shared/providers'

import { routes } from './app.routes'

import { credentialsInterceptor } from '@core/interceptors'

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideHttpClient(withFetch(), withInterceptors([credentialsInterceptor])),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideAuth({ apiUrl: 'http://localhost:3000' }),
    provideEnvironment({
      apiUrl: 'http://localhost:3000',
      applicationName: 'Neko Music',
      production: false,
    }),
    {
      provide: WINDOW,
      useFactory: (document: Document) => windowProvider(document),
      deps: [DOCUMENT],
    },
  ],
}
