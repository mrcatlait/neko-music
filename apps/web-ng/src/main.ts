import { bootstrapApplication } from '@angular/platform-browser'
import { provideExperimentalZonelessChangeDetection } from '@angular/core'
import { provideRouter } from '@angular/router'
import { provideHttpClient } from '@angular/common/http'

import { routes } from './app/app-routing.module'
import { AppComponent } from './app/app.component'

import { environment } from '@environment'
import { API_URL, ENVIRONMENT } from '@core/tokens'

// platformBrowserDynamic()
//   .bootstrapModule(AppModule, {
//     ngZone: 'noop',
//   })
//   .catch((err) => console.error(err))

bootstrapApplication(AppComponent, {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
    { provide: ENVIRONMENT, useValue: environment },
    { provide: API_URL, useValue: environment.apiUrl },
  ],
})
