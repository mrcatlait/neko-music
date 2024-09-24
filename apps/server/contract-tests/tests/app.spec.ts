import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { FastifyAdapter } from '@nestjs/platform-fastify'
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql'
import { MessageStateHandlers } from '@pact-foundation/pact'

import { PactModule, PactVerifierService } from 'contract-tests/pact.module'
import { AppModule } from 'src/app.module'
import { ConfigService } from '@core/services'
import { registerTrackRepositories, tracks } from 'contract-tests/fixtures'

describe('Pact Verification', () => {
  let postgresContainer: StartedPostgreSqlContainer
  let verifierService: PactVerifierService
  let app: INestApplication

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
            default:
              return ''
          }
        },
      })

    registerTrackRepositories(moduleBuilder)

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
