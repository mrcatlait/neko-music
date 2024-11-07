import { Test } from '@nestjs/testing'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql'
import { PartiallyMocked } from 'vitest'
import { HttpStatus, UnauthorizedException } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { ConfigService } from '@shared/services'
import { AppModule } from '@modules/app'
import { AuthGuard } from '@modules/authentication/guards'
import { ArtistEntity } from '@modules/artist/entities'
import { TracksPageDto } from '@modules/track/dto'
import { ArtistDto } from '@modules/artist/dto'

describe('Artists', () => {
  let authGuardMock: PartiallyMocked<AuthGuard>
  let postgresContainer: StartedPostgreSqlContainer
  let app: NestFastifyApplication
  let artistRepository: Repository<ArtistEntity>
  let existingArtistId: string
  let nonExistingArtistId: string
  beforeAll(async () => {
    postgresContainer = await new PostgreSqlContainer().start()

    authGuardMock = {
      canActivate: vi.fn().mockRejectedValue(new UnauthorizedException()),
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

    artistRepository = moduleRef.get(getRepositoryToken(ArtistEntity))
    existingArtistId = (
      await artistRepository.findOneOrFail({
        where: {},
      })
    ).id
    nonExistingArtistId = 'eff19ecc-3398-4b44-a63c-f5cb427c8c05'

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

  describe('/artists/:artistId (GET)', () => {
    it('should return 401 if user is not authenticated', () => {
      return app
        .inject({
          method: 'GET',
          url: `/artists/${existingArtistId}`,
        })
        .then((response) => {
          expect(response.statusCode).toEqual(HttpStatus.UNAUTHORIZED)
        })
    })

    it('should return 404 if artist does not exist', () => {
      authGuardMock.canActivate?.mockResolvedValueOnce(true)

      return app.inject({ method: 'GET', url: `/artists/${nonExistingArtistId}` }).then((response) => {
        expect(response.statusCode).toEqual(HttpStatus.NOT_FOUND)
      })
    })

    it('should return artist details', () => {
      authGuardMock.canActivate?.mockResolvedValueOnce(true)

      return app.inject({ method: 'GET', url: `/artists/${existingArtistId}` }).then((response) => {
        expect(response.statusCode).toEqual(HttpStatus.OK)
        const json = response.json<ArtistDto>()
        expect(json.id).toEqual(existingArtistId)
      })
    })
  })

  describe('/artists/:artistId/tracks (GET)', () => {
    it('should return list of artist tracks', () => {
      authGuardMock.canActivate?.mockResolvedValueOnce(true)

      return app.inject({ method: 'GET', url: `/artists/${existingArtistId}/tracks` }).then((response) => {
        expect(response.statusCode).toEqual(HttpStatus.OK)
        const json = response.json<TracksPageDto>()
        expect(json.data).toBeDefined()
      })
    })

    it('should return 404 if artist does not exist', () => {
      authGuardMock.canActivate?.mockResolvedValueOnce(true)

      return app.inject({ method: 'GET', url: `/artists/${nonExistingArtistId}/tracks` }).then((response) => {
        expect(response.statusCode).toEqual(HttpStatus.NOT_FOUND)
      })
    })

    it('should return 401 if user is not authenticated', () => {
      return app.inject({ method: 'GET', url: `/artists/${existingArtistId}/tracks` }).then((response) => {
        expect(response.statusCode).toEqual(HttpStatus.UNAUTHORIZED)
      })
    })
  })
})
