import { Test } from '@nestjs/testing'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql'

import { AppModule } from 'src/app.module'
import { ConfigService } from '@core/services'

describe('Tracks', () => {
  let postgresContainer: StartedPostgreSqlContainer
  let app: NestFastifyApplication

  beforeAll(async () => {
    postgresContainer = await new PostgreSqlContainer().start()

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
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
      .compile()

    app = moduleRef.createNestApplication<NestFastifyApplication>(new FastifyAdapter())

    await app.init()
    await app.getHttpAdapter().getInstance().ready()
  })

  afterAll(async () => {
    await app.close()
    await postgresContainer.stop()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('/tracks (GET)', () => {
    it('should return list of tracks', () => {
      return app
        .inject({
          method: 'GET',
          url: '/tracks',
        })
        .then((response) => {
          expect(response.statusCode).toEqual(200)

          const body = JSON.parse(response.body)
          expect(body.data.length).toBe(1)
          expect(body.data[0].title).toBe('Bad Romance')
        })
    })
  })
})