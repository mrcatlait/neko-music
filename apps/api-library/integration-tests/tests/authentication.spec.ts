import { Test } from '@nestjs/testing'
import { faker } from '@faker-js/faker'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { RegisterHandler } from '@modules/authentication/registration/commands'
import { LoginHandler } from '@modules/authentication/login/commands'

import { AppModule } from '@modules/app/app.module'
import { EnvironmentVariables } from '@modules/shared/models'

describe('Authentication', () => {
  let app: NestFastifyApplication
  let postgresContainer: StartedPostgreSqlContainer

  beforeAll(async () => {
    postgresContainer = await new PostgreSqlContainer().start()

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ConfigService)
      .useValue({
        get: (key: keyof EnvironmentVariables): string | number => {
          switch (key) {
            case 'DATABASE_HOST':
              return postgresContainer.getHost()
            case 'DATABASE_PORT':
              return postgresContainer.getPort()
            case 'DATABASE_USERNAME':
              return postgresContainer.getUsername()
            case 'DATABASE_PASSWORD':
              return postgresContainer.getPassword()
            case 'DATABASE_NAME':
              return postgresContainer.getDatabase()
            case 'SALT_ROUNDS':
              return 10
            case 'JWT_SECRET':
              return 'secret'
            case 'JWT_TOKEN_EXPIRATION_TIME':
              return '1h'
            case 'JWT_REFRESH_SECRET':
              return 'refresh-secret'
            case 'JWT_REFRESH_TOKEN_EXPIRATION_TIME':
              return '1d'
            case 'JWT_ISSUER':
              return 'neko'
            case 'JWT_AUDIENCE':
              return 'neko'
            default:
              return ''
          }
        },
      })
      .compile()

    app = moduleRef.createNestApplication<NestFastifyApplication>(new FastifyAdapter())

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    )
    const reflector = app.get(Reflector)
    app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector))

    await app.register(await import('@fastify/cookie'))

    try {
      await app.init()
      await app.getHttpAdapter().getInstance().ready()
    } catch (error) {
      console.error(error)

      if (postgresContainer) {
        await postgresContainer.stop()
      }
    }
  })

  afterAll(async () => {
    if (app) {
      await app.close()
    }

    if (postgresContainer) {
      await postgresContainer.stop()
    }
  })

  describe('POST /register', () => {
    const url = '/auth/register'

    it('should return 400 status code if the body is missing', async () => {
      const response = await app.inject({
        method: 'POST',
        url,
        payload: {},
      })

      // Assert
      expect(response.statusCode).toBe(400)
    })

    it('should return 400 status code if the body is invalid', async () => {
      // Arrange
      const credentials = {
        email: 'invalid',
        password: 'invalid',
      }

      // Act
      const response = await app.inject({
        method: 'POST',
        url,
        payload: credentials,
      })

      // Assert
      expect(response.statusCode).toBe(400)
    })

    it('should return 400 status code if password does not meet minimum requirements', async () => {
      // Arrange
      const credentials = {
        email: faker.internet.email(),
        password: '123',
      }

      // Act
      const response = await app.inject({
        method: 'POST',
        url,
        payload: credentials,
      })

      // Assert
      expect(response.statusCode).toBe(400)
    })

    it('should return 400 status code if email format is invalid', async () => {
      // Arrange
      const credentials = {
        email: 'not.an.email',
        password: 'validPassword123',
      }

      // Act
      const response = await app.inject({
        method: 'POST',
        url,
        payload: credentials,
      })

      // Assert
      expect(response.statusCode).toBe(400)
    })

    it('should return 201 status code if the user is registered', async () => {
      // Arrange
      const credentials = {
        email: faker.internet.email(),
        password: 'password',
      }

      // Act
      const response = await app.inject({
        method: 'POST',
        url,
        payload: credentials,
      })

      // Assert
      expect(response.statusCode).toBe(201)
      expect(response.json()).toMatchObject({
        accessToken: expect.any(String),
      })
    })

    it('should return 400 status code if the user is already registered', async () => {
      // Arrange
      const credentials = {
        email: faker.internet.email(),
        password: 'password',
      }

      await app.get(RegisterHandler).handle(credentials)

      // Act
      const response = await app.inject({
        method: 'POST',
        url,
        payload: credentials,
      })

      // Assert
      expect(response.statusCode).toBe(400)
    })
  })

  describe('POST /login', () => {
    const url = '/auth/login'

    it('should return 401 status code if the user is not found', async () => {
      // Arrange
      const credentials = {
        email: faker.internet.email(),
        password: 'password',
      }

      // Act
      const response = await app.inject({
        method: 'POST',
        url,
        payload: credentials,
      })

      // Assert
      expect(response.statusCode).toBe(401)
    })

    it('should return 401 status code if password is incorrect', async () => {
      // Arrange
      const registerCredentials = {
        email: faker.internet.email(),
        password: 'correctPassword123',
      }
      await app.get(RegisterHandler).handle(registerCredentials)

      const loginCredentials = {
        email: registerCredentials.email,
        password: 'wrongPassword123',
      }

      // Act
      const response = await app.inject({
        method: 'POST',
        url,
        payload: loginCredentials,
      })

      // Assert
      expect(response.statusCode).toBe(401)
    })

    it('should return 400 status code if the body is missing', async () => {
      // Act
      const response = await app.inject({
        method: 'POST',
        url,
      })

      // Assert
      expect(response.statusCode).toBe(400)
    })

    it('should return 400 status code if the body is invalid', async () => {
      // Arrange
      const credentials = {
        email: 'invalid',
        password: 'password',
      }

      // Act
      const response = await app.inject({
        method: 'POST',
        url,
        payload: credentials,
      })

      // Assert
      expect(response.statusCode).toBe(400)
    })

    it('should return 201 status code if the user is found', async () => {
      // Arrange
      const credentials = {
        email: faker.internet.email(),
        password: 'password',
      }

      await app.get(RegisterHandler).handle(credentials)

      const response = await app.inject({
        method: 'POST',
        url,
        payload: credentials,
      })

      // Assert
      expect(response.statusCode).toBe(201)
      expect(response.json()).toMatchObject({
        accessToken: expect.any(String),
      })
    })
  })

  describe('GET /refresh', () => {
    const url = '/auth/refresh'

    it('should return 403 status code if cookie is missing', async () => {
      // Arrange
      const response = await app.inject({
        method: 'GET',
        url,
      })

      // Assert
      expect(response.statusCode).toBe(403)
    })

    it('should return 403 status code if cookie is invalid', async () => {
      // Arrange
      const response = await app.inject({
        method: 'GET',
        url,
        headers: {
          Cookie: 'neko.refresh.token=invalid',
        },
      })

      // Assert
      expect(response.statusCode).toBe(403)
    })

    it('should return 200 status code if cookie is valid', async () => {
      // Arrange
      const credentials = {
        email: faker.internet.email(),
        password: 'password',
      }

      await app.get(RegisterHandler).handle(credentials)

      const { refreshToken } = await app.get(LoginHandler).handle(credentials)

      // Act
      const response = await app.inject({
        method: 'GET',
        url,
        headers: {
          Cookie: `neko.refresh.token=${refreshToken}`,
        },
      })

      // Assert
      expect(response.statusCode).toBe(200)
      expect(response.json()).toMatchObject({
        accessToken: expect.any(String),
      })
    })

    it('should return 403 status code if refresh token was already used', async () => {
      // Arrange
      const credentials = {
        email: faker.internet.email(),
        password: 'password',
      }

      await app.get(RegisterHandler).handle(credentials)

      const { refreshToken } = await app.get(LoginHandler).handle(credentials)

      await app.inject({
        method: 'GET',
        url,
        headers: {
          Cookie: `neko.refresh.token=${refreshToken}`,
        },
      })

      // Act
      const response = await app.inject({
        method: 'GET',
        url,
        headers: {
          Cookie: `neko.refresh.token=${refreshToken}`,
        },
      })

      // Assert
      expect(response.statusCode).toBe(403)
    })
  })
})
