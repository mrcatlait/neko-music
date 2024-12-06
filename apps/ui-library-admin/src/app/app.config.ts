import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core'
import { provideRouter } from '@angular/router'
import { provideEnvironment } from '@neko/ui-shared'

import { routes } from './app.routes'

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes),
    provideEnvironment({
      production: false,
      apiUrl: 'http://localhost:3000',
      applicationName: 'ui-library-admin',
    }),
  ],
}
