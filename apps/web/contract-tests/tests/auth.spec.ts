import { provideHttpClient } from '@angular/common/http'
import { TestBed } from '@angular/core/testing'
import { Matchers, V3MockServer } from '@pact-foundation/pact'
import { firstValueFrom } from 'rxjs'
import { Contracts } from '@neko/contracts'

import { provider } from '../provider'
import { PactMatcher } from '../types'

import { AuthApi } from '@/core/auth/auth-api'
import { ENVIRONMENT } from '@/core/providers'

const injectApi = (mockServer: V3MockServer) => {
  TestBed.configureTestingModule({
    providers: [AuthApi, provideHttpClient(), { provide: ENVIRONMENT, useValue: { apiUrl: mockServer.url } }],
  })

  return TestBed.inject(AuthApi)
}

describe('Auth', () => {
  describe('POST /auth/login', () => {
    it('should successfully login a user', async () => {
      await provider
        .addInteraction()
        .given('a user exists')
        .uponReceiving('a request to login')
        .withRequest('POST', '/auth/login', (builder) => {
          builder.jsonBody({
            email: 'test@example.com',
            password: 'password123',
          } as Contracts.Auth.LoginRequest)
        })
        .willRespondWith(200, (builder) => {
          builder.jsonBody({
            accessToken: Matchers.string('test-access-token'),
            email: Matchers.string('test@example.com'),
            displayName: Matchers.string('John Doe'),
            role: Matchers.string('user'),
          } as PactMatcher<Contracts.Auth.LoginResponse>)
        })
        .executeTest(async (mockServer) => {
          const api = injectApi(mockServer)
          const response = await firstValueFrom(api.login({ email: 'test@example.com', password: 'password123' }))
          expect(response.accessToken).toBe('test-access-token')

          return response
        })
    })
  })
})
