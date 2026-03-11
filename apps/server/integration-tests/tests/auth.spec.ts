import request from 'supertest'
import { Contracts } from '@neko/contracts'

import { app } from '../test-setup'

import { ACCESS_TOKEN_HEADER_NAME } from '@/modules/auth/constants'
import { Context, Params } from 'integration-tests/utils'

type RegistrationOptions = Partial<Contracts.Auth.RegistrationRequest>

const getRegistrationPayload = (
  context: Context,
  options: RegistrationOptions = {},
): Contracts.Auth.RegistrationRequest => {
  const params = new Params<RegistrationOptions>(context, options)

  return {
    email: params.alias('email', 'test@example.com'),
    password: params.optional('password', 'password123'),
    displayName: params.optional('displayName', 'Test User'),
  }
}

type LoginOptions = Partial<Contracts.Auth.LoginRequest>

const getLoginPayload = (context: Context, options: LoginOptions = {}): Contracts.Auth.LoginRequest => {
  const params = new Params<LoginOptions>(context, options)

  return {
    email: params.alias('email', 'test@example.com'),
    password: params.optional('password', 'password123'),
  }
}

describe('Auth', () => {
  describe('POST /auth/register', () => {
    let context: Context

    beforeEach(() => {
      context = new Context()
    })

    it('should successfully register a user', async () => {
      // Arrange
      const payload = getRegistrationPayload(context)

      // Act
      const response = await request(app.getHttpServer()).post('/auth/register').send(payload)

      // Assert
      expect(response.status).toBe(201)
      expect(response.body).toMatchObject({
        email: payload.email,
        displayName: payload.displayName,
        accessToken: expect.any(String),
        role: expect.any(String),
      } as Contracts.Auth.LoginResponse)
    })

    it('should fail to register a user if email is already in use', async () => {
      // Arrange
      const payload = getRegistrationPayload(context)
      await request(app.getHttpServer()).post('/auth/register').send(payload)

      // Act
      const response = await request(app.getHttpServer()).post('/auth/register').send(payload)

      // Assert
      expect(response.status).toBe(400)
      expect(response.body).toMatchObject({
        message: ['emailTaken'],
      })
    })

    it('should fail to register a user if email is invalid', async () => {
      // Arrange
      const payload = getRegistrationPayload(context, {
        email: 'invalid-email',
      })

      // Act
      const response = await request(app.getHttpServer()).post('/auth/register').send(payload)

      // Assert
      expect(response.status).toBe(400)
      expect(response.body).toMatchObject({
        message: ['email must be an email'],
        error: 'Bad Request',
      })
    })

    it('should fail to register a user if password is invalid', async () => {
      // Arrange
      const payload = getRegistrationPayload(context, {
        password: 'invalid',
      })

      // Act
      const response = await request(app.getHttpServer()).post('/auth/register').send(payload)

      // Assert
      expect(response.status).toBe(400)
      expect(response.body).toMatchObject({
        message: [
          'password must match /[^a-zA-Z]/ regular expression',
          'password must be longer than or equal to 8 characters',
        ],
        error: 'Bad Request',
      })
    })
  })

  describe('POST /auth/login', () => {
    const context = new Context()

    beforeAll(async () => {
      const payload = getRegistrationPayload(context)
      await request(app.getHttpServer()).post('/auth/register').send(payload)
    })

    it('should successfully login a user', async () => {
      // Act
      const payload = getLoginPayload(context)
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: payload.email,
          password: payload.password,
        } as Contracts.Auth.LoginRequest)

      // Assert
      expect(response.status).toBe(200)
      expect(response.body).toMatchObject({
        email: payload.email,
        accessToken: expect.any(String),
        displayName: expect.any(String),
        role: expect.any(String),
      } as Contracts.Auth.LoginResponse)
    })

    it('should fail to login a user if email is incorrect', async () => {
      // Act
      const payload = getLoginPayload(context, {
        email: 'incorrect@example.com',
      })
      const response = await request(app.getHttpServer()).post('/auth/login').send(payload)

      // Assert
      expect(response.status).toBe(401)
      expect(response.body).toMatchObject({
        message: 'Unauthorized',
      })
    })

    it('should fail to login a user if password is incorrect', async () => {
      // Act
      const payload = getLoginPayload(context, {
        password: 'incorrect',
      })
      const response = await request(app.getHttpServer()).post('/auth/login').send(payload)

      // Assert
      expect(response.status).toBe(401)
      expect(response.body).toMatchObject({
        message: 'Unauthorized',
      })
    })
  })

  describe('GET /auth/refresh', () => {
    it('should successfully refresh a user', async () => {
      const payload = getRegistrationPayload(new Context())
      const registerResponse = await request(app.getHttpServer()).post('/auth/register').send(payload)
      expect(registerResponse.body).toMatchObject({
        accessToken: expect.any(String),
      })

      const cookies = registerResponse.headers['set-cookie'][0]

      // Act
      const response = await request(app.getHttpServer()).get('/auth/refresh').set('Cookie', cookies)

      // Assert
      expect(response.status).toBe(200)
      expect(response.body).toMatchObject({
        accessToken: expect.any(String),
      })
    })

    it('should fail to refresh a user if refresh token is invalid', async () => {
      // Act
      const response = await request(app.getHttpServer()).get('/auth/refresh').set('Cookie', 'invalid-token')

      // Assert
      expect(response.status).toBe(401)
      expect(response.body).toMatchObject({
        message: 'Unauthorized',
      })
    })
  })

  describe('GET /auth/whoami', () => {
    it('should successfully get the current user', async () => {
      // Arrange
      const payload = getRegistrationPayload(new Context())
      const registerResponse = await request(app.getHttpServer()).post('/auth/register').send(payload)

      const accessToken = (registerResponse.body as Contracts.Auth.LoginResponse).accessToken

      // Act
      const response = await request(app.getHttpServer())
        .get('/auth/whoami')
        .set(ACCESS_TOKEN_HEADER_NAME, `Bearer ${accessToken}`)

      // Assert
      expect(response.status).toBe(200)
      expect(response.body).toMatchObject({
        email: payload.email,
        displayName: payload.displayName,
        role: expect.any(String),
      } as Contracts.Auth.WhoamiResponse)
    })

    it('should fail to get the current user if access token is invalid', async () => {
      // Act
      const response = await request(app.getHttpServer())
        .get('/auth/whoami')
        .set('Authorization', 'Bearer invalid-token')

      // Assert
      expect(response.status).toBe(401)
      expect(response.body).toMatchObject({
        message: 'Unauthorized',
      })
    })
  })
})
