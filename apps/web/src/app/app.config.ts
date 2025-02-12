import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core'
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router'
import { provideHttpClient, withFetch } from '@angular/common/http'
import { DOCUMENT } from '@angular/common'
import { provideAuth } from '@neko/ui-auth'
import { provideEnvironment, WINDOW, windowProvider } from '@neko/ui-shared/providers'

import { routes } from './app.routes'

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideHttpClient(withFetch()),
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
