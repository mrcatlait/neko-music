import { MatchersV3, PactV4 } from '@pact-foundation/pact'
import { firstValueFrom } from 'rxjs'
import { resolve } from 'path'

import { AuthRepository } from '@core/repositories'
import { repositoryProvider } from 'contract-tests/utils'
import { LoginDto, RegisterDto } from '@core/dto'
import {
  loginDto,
  loginSuccess,
  loginSuccessResponseBody,
  registerDto,
  registerSuccess,
  registerSuccessResponseBody,
} from 'contract-tests/fixtures'

describe('Auth', () => {
  const provider = new PactV4({
    logLevel: 'info',
    consumer: 'web',
    provider: 'music-library-api',
    dir: resolve(process.cwd(), '..', '..', 'contracts'),
  })

  describe('POST /auth/login', () => {
    it('returns an HTTP 200 and a login response', async () => {
      await provider
        .addInteraction()
        .uponReceiving('a request to POST login')
        .withRequest('POST', '/auth/login', (builder) => builder.jsonBody(loginDto))
        .willRespondWith(200, (builder) => builder.jsonBody(loginSuccessResponseBody))
        .executeTest(async (mockServer) => {
          const repository = repositoryProvider(AuthRepository, mockServer)
          const dto = MatchersV3.extractPayload(loginDto) as unknown as LoginDto

          await firstValueFrom(repository.login(dto)).then((response) => {
            expect(response).toEqual(loginSuccess)
          })
        })
    })
  })

  describe('POST /auth/register', () => {
    it('returns an HTTP 201 and a login response', async () => {
      await provider
        .addInteraction()
        .uponReceiving('a request to POST register')
        .withRequest('POST', '/auth/register', (builder) => builder.jsonBody(registerDto))
        .willRespondWith(201, (builder) => builder.jsonBody(registerSuccessResponseBody))
        .executeTest(async (mockServer) => {
          const repository = repositoryProvider(AuthRepository, mockServer)
          const dto = MatchersV3.extractPayload(registerDto) as RegisterDto

          await firstValueFrom(repository.register(dto)).then((response) => {
            expect(response).toEqual(registerSuccess)
          })
        })
    })
  })

  describe.skip('POST /auth/logout', () => {
    it('returns an HTTP 200', async () => {
      await provider
        .addInteraction()
        .given('authenticated user')
        .uponReceiving('a request to POST logout')
        .withRequest('POST', '/auth/logout', (builder) => builder.jsonBody({}))
        .willRespondWith(200)
        .executeTest(async (mockServer) => {
          const repository = repositoryProvider(AuthRepository, mockServer)

          await firstValueFrom(repository.logout()).then((response) => {
            expect(response).toBeDefined()
          })
        })
    })
  })

  describe('GET /auth/whoami', () => {
    it('returns an HTTP 200 and a login response', async () => {
      await provider
        .addInteraction()
        .given('authenticated user')
        .uponReceiving('a request to GET whoami')
        .withRequest('GET', '/auth/whoami')
        .willRespondWith(200, (builder) => builder.jsonBody(loginSuccessResponseBody))
        .executeTest(async (mockServer) => {
          const repository = repositoryProvider(AuthRepository, mockServer)

          await firstValueFrom(repository.whoAmI()).then((response) => {
            expect(response).toEqual(loginSuccess)
          })
        })
    })

    it('returns an HTTP 401', async () => {
      await provider
        .addInteraction()
        .uponReceiving('a request to GET whoami')
        .withRequest('GET', '/auth/whoami')
        .willRespondWith(401)
        .executeTest(async (mockServer) => {
          const repository = repositoryProvider(AuthRepository, mockServer)

          await expect(firstValueFrom(repository.whoAmI())).rejects.toThrow()
        })
    })
  })
})
