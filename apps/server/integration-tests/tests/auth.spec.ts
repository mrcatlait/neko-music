import request from 'supertest'

import { app } from '../test-setup'

import { LoginResponse } from '@/modules/auth/dtos'
import { ACCESS_TOKEN_HEADER_NAME } from '@/modules/auth/constants'

describe('Auth', () => {
  describe('POST /auth/register', () => {
    it('should successfully register a user', async () => {
      // Arrange
      const payload = {
        email: 'test@example.com',
        password: 'password123',
        displayName: 'Test User',
      }

      // Act
      const response = await request(app.getHttpServer()).post('/auth/register').send(payload)

      // Assert
      expect(response.status).toBe(201)
      expect(response.body).toMatchObject({
        email: payload.email,
        displayName: payload.displayName,
        accessToken: expect.any(String),
        permissions: expect.any(Array),
      })
    })

    it('should fail to register a user if email is already in use', async () => {
      // Arrange
      const payload = {
        email: 'existing@example.com',
        password: 'password123',
        displayName: 'Test User',
      }
      await request(app.getHttpServer()).post('/auth/register').send(payload)

      // Act
      const response = await request(app.getHttpServer()).post('/auth/register').send(payload)

      // Assert
      expect(response.status).toBe(400)
      expect(response.body).toMatchObject({
        message: ['emailTaken'],
      })
    })

    /**
     * @todo Test email and password validation
     */
  })

  describe('POST /auth/login', () => {
    const credentials = {
      email: 'login-test@example.com',
      password: 'password123',
    }

    beforeAll(async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          ...credentials,
          displayName: 'Test User',
        })
    })

    it('should successfully login a user', async () => {
      // Act
      const response = await request(app.getHttpServer()).post('/auth/login').send(credentials)

      // Assert
      expect(response.status).toBe(201)
      expect(response.body).toMatchObject({
        accessToken: expect.any(String),
        email: credentials.email,
        displayName: expect.any(String),
        permissions: expect.any(Array),
      })
    })

    it('should fail to login a user if email is incorrect', async () => {
      // Act
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          ...credentials,
          email: 'incorrect@example.com',
        })

      // Assert
      expect(response.status).toBe(401)
      expect(response.body).toMatchObject({
        message: 'Unauthorized',
      })
    })

    it('should fail to login a user if password is incorrect', async () => {
      // Act
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          ...credentials,
          password: 'incorrect',
        })

      // Assert
      expect(response.status).toBe(401)
      expect(response.body).toMatchObject({
        message: 'Unauthorized',
      })
    })
  })

  describe('GET /auth/refresh', () => {
    it('should successfully refresh a user', async () => {
      const credentials = {
        email: 'refresh-test@example.com',
        password: 'password123',
      }

      const registerResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          ...credentials,
          displayName: 'Test User',
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
      const credentials = {
        email: 'whoami-test@example.com',
        password: 'password123',
      }

      const registerResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          ...credentials,
          displayName: 'Test User',
        })

      const accessToken = (registerResponse.body as LoginResponse).accessToken

      // Act
      const response = await request(app.getHttpServer())
        .get('/auth/whoami')
        .set(ACCESS_TOKEN_HEADER_NAME, `Bearer ${accessToken}`)

      // Assert
      expect(response.status).toBe(200)
      expect(response.body).toMatchObject({
        email: credentials.email,
        displayName: 'Test User',
        permissions: expect.any(Array),
      })
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
