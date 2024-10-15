import { Test } from '@nestjs/testing'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql'
import { MessageStateHandlers } from '@pact-foundation/pact'

import { PactModule, PactVerifierService } from 'contract-tests/pact.module'
import { artists, registerRepositories, tracks } from 'contract-tests/fixtures'
import { ConfigService } from '@shared/services'
import { AppModule } from '@modules/app'

describe('Pact Verification', () => {
  let postgresContainer: StartedPostgreSqlContainer
  let verifierService: PactVerifierService
  let app: NestFastifyApplication

  beforeAll(async () => {
    postgresContainer = await new PostgreSqlContainer().start()

    const stateHandlers: MessageStateHandlers = {
      'list of tracks is empty': () => {
        tracks.getTracksEmpty()

        return Promise.resolve()
      },
      'list of tracks exists': () => {
        tracks.getTracksSuccess()

        return Promise.resolve()
      },
      'artist exists': () => {
        artists.getArtistSuccess()

        return Promise.resolve()
      },
      'artist exists and list of tracks exists': () => {
        artists.getArtistTracksSuccess()

        return Promise.resolve()
      },
    }

    const moduleBuilder = Test.createTestingModule({
      imports: [PactModule.register({ stateHandlers }), AppModule],
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

    registerRepositories(moduleBuilder)

    const moduleRef = await moduleBuilder.compile()

    verifierService = moduleRef.get(PactVerifierService)

    app = moduleRef.createNestApplication(new FastifyAdapter())

    await app.init()
  })

  afterAll(async () => {
    await app.close()
    await postgresContainer.stop()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('validates the expectations of Matching Service', async () => {
    await verifierService.verify(app)
  })
})
