import { Test } from '@nestjs/testing'
import { NestFastifyApplication } from '@nestjs/platform-fastify'
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql'
import { VerifierOptions as PactVerifierOptions } from '@pact-foundation/pact'
import { StateFuncWithSetup } from '@pact-foundation/pact/src/dsl/verifier/proxy/types'

import { PactModule, PactVerifierService } from 'contract-tests/pact.module'
import { artists, auth, playlists, registerDatabaseMocks, tracks } from 'contract-tests/fixtures'
import { ConfigService } from '@shared/services'
import { AppModule } from '@modules/app'
import { mockSessionMiddleware } from 'contract-tests/mock-session.middleware'
import { createTestApp } from 'src/util'

// Pact has a bug with stateHandlers, it expects a string as a first argument
interface VerifierOptions extends Omit<PactVerifierOptions, 'stateHandlers'> {
  stateHandlers?: Record<string, StateFuncWithSetup>
}

describe('Pact Verification', () => {
  let postgresContainer: StartedPostgreSqlContainer
  let verifierService: PactVerifierService
  let app: NestFastifyApplication

  beforeAll(async () => {
    postgresContainer = await new PostgreSqlContainer().start()

    let token = ''

    const options: VerifierOptions = {
      stateHandlers: {
        'authenticated user': {
          setup: () => {
            token = 'mock-session'
            return Promise.resolve()
          },
          teardown: () => {
            token = ''
            return Promise.resolve()
          },
        },
        'user exists': auth.userExists,
        'has tracks': tracks.getTracksSuccess,
        'has no tracks': tracks.getTracksEmpty,
        'has artist': artists.getArtistSuccess,
        'has artist tracks': artists.getArtistTracksSuccess,
        'has own playlist': playlists.getMyPlaylistSuccess,
        'has tracks in playlist': playlists.getPlaylistTracksSuccess,
      },
      requestFilter: (req, res, next) => {
        req.headers['Authorization'] = token
        next()
      },
    }

    const moduleRef = await Test.createTestingModule({
      imports: [PactModule.register(options as PactVerifierOptions), AppModule],
    })
      .overrideProvider(ConfigService)
      .useValue({
        get: (key: string): string | number => {
          switch (key) {
            case 'MEDIA_URL':
              return 'MEDIA_URL'
            case 'POSTGRES_HOST':
              return postgresContainer.getHost()
            case 'POSTGRES_PORT':
              return postgresContainer.getPort()
            case 'POSTGRES_USER':
              return postgresContainer.getUsername()
            case 'POSTGRES_PASSWORD':
              return postgresContainer.getPassword()
            case 'POSTGRES_DB':
              return postgresContainer.getDatabase()
            case 'JWT_REFRESH_SECRET':
            case 'JWT_SECRET':
              return 'secret'
            default:
              return ''
          }
        },
      })
      .compile()

    verifierService = moduleRef.get(PactVerifierService)

    registerDatabaseMocks(moduleRef)

    app = await createTestApp(moduleRef)

    app.getHttpAdapter().getInstance().addHook('preHandler', mockSessionMiddleware)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
    await postgresContainer.stop()
  })

  it('validates the expectations of Matching Service', async () => {
    await verifierService.verify(app)
  })
})
