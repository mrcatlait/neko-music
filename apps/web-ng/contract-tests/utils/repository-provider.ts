import { provideHttpClient } from '@angular/common/http'
import { ProviderToken } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { V3MockServer } from '@pact-foundation/pact'

import { API_URL } from '@core/tokens'

export const repositoryProvider = <T>(repository: ProviderToken<T>, mockServer: V3MockServer): T => {
  TestBed.configureTestingModule({
    providers: [repository, provideHttpClient(), { provide: API_URL, useValue: mockServer.url }],
  })
  return TestBed.inject(repository)
}
