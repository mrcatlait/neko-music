import { Test } from '@nestjs/testing'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql'
import { PartiallyMocked } from 'vitest'
import { UnauthorizedException } from '@nestjs/common'

import { ConfigService } from '@shared/services'
import { AppModule } from '@modules/app'
import { TracksPageDto } from '@modules/track/dto'
import { AuthGuard } from '@modules/authentication/guards'

describe('Tracks', () => {
  let authGuardMock: PartiallyMocked<AuthGuard>
  let postgresContainer: StartedPostgreSqlContainer
  let app: NestFastifyApplication

  beforeAll(async () => {
    postgresContainer = await new PostgreSqlContainer().start()

    authGuardMock = {
      canActivate: vi.fn().mockRejectedValueOnce(new UnauthorizedException()),
    }

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
            case 'JWT_REFRESH_SECRET':
            case 'JWT_SECRET':
              return 'secret'
            default:
              return ''
          }
        },
      })
      .overrideProvider(AuthGuard)
      .useValue(authGuardMock)
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
    it('should return 401 if user is not authenticated', () => {
      return app
        .inject({
          method: 'GET',
          url: '/tracks',
        })
        .then((response) => {
          expect(response.statusCode).toEqual(401)
        })
    })

    it('should return list of tracks if user is authenticated', () => {
      authGuardMock.canActivate?.mockResolvedValue(true)

      return app
        .inject({
          method: 'GET',
          url: '/tracks',
        })
        .then((response) => {
          expect(response.statusCode).toEqual(200)

          const body = JSON.parse(response.body) as TracksPageDto
          expect(body.data.length).toBe(0)
        })
    })
  })
})
