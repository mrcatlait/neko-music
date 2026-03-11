import { HttpInterceptorFn, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http'
import { TestBed } from '@angular/core/testing'
import { V3MockServer } from '@pact-foundation/pact'
import { ProviderToken } from '@angular/core'

import { ENVIRONMENT } from '@/core/providers'

export const ACCESS_TOKEN = 'test-access-token'

const stubbedJwtInterceptor: HttpInterceptorFn = (request, next) => {
  const patchedRequest = request.clone({
    headers: request.headers.set('Authorization', `Bearer ${ACCESS_TOKEN}`),
  })

  return next(patchedRequest)
}

export const injectApi = <T>(mockServer: V3MockServer, apiClass: ProviderToken<T>): T => {
  TestBed.configureTestingModule({
    providers: [
      apiClass,
      provideHttpClient(withFetch(), withInterceptors([stubbedJwtInterceptor])),
      { provide: ENVIRONMENT, useValue: { apiUrl: mockServer.url } },
    ],
  })

  return TestBed.inject(apiClass)
}
