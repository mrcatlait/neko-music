import { treaty } from '@elysiajs/eden'
import { describe, expect, it } from 'bun:test'
import { faker } from '@faker-js/faker'

import { authController } from '@features/authentication/infrastructure/controllers'
import { Container } from '@common/di'
import { RegisterHandler } from '@features/authentication/registration/commands'
import { LoginHandler } from '@features/authentication/login/commands'

describe('Authentication', () => {
  describe('POST /register', () => {
    it('should return 422 status code if the body is missing', async () => {
      // Arrange
      const api = treaty(authController())

      // Act
      const response = await api.auth.register.post({} as any)

      // Assert
      expect(response.status).toBe(422)
    })

    it('should return 422 status code if the body is invalid', async () => {
      // Arrange
      const credentials = {
        email: 'invalid',
        password: 'invalid',
      }

      const api = treaty(authController())

      // Act
      const response = await api.auth.register.post(credentials)

      // Assert
      expect(response.status).toBe(422)
    })

    it('should return 422 status code if password does not meet minimum requirements', async () => {
      // Arrange
      const credentials = {
        email: faker.internet.email(),
        password: '123',
      }
      const api = treaty(authController())

      // Act
      const response = await api.auth.register.post(credentials)

      // Assert
      expect(response.status).toBe(422)
    })

    it('should return 422 status code if email format is invalid', async () => {
      // Arrange
      const credentials = {
        email: 'not.an.email',
        password: 'validPassword123',
      }
      const api = treaty(authController())

      // Act
      const response = await api.auth.register.post(credentials)

      // Assert
      expect(response.status).toBe(422)
    })

    it('should return 200 status code if the user is registered', async () => {
      // Arrange
      const credentials = {
        email: faker.internet.email(),
        password: 'password',
      }

      const api = treaty(authController())

      // Act
      const response = await api.auth.register.post(credentials)

      // Assert
      expect(response.status).toBe(200)
      expect(response.data).toMatchObject({
        accessToken: expect.any(String),
      })
    })

    it('should return 400 status code if the user is already registered', async () => {
      // Arrange
      const credentials = {
        email: faker.internet.email(),
        password: 'password',
      }

      await Container.get(RegisterHandler).handle(credentials)

      const api = treaty(authController())

      // Act
      const response = await api.auth.register.post(credentials)

      // Assert
      expect(response.status).toBe(400)
    })
  })

  describe('POST /login', () => {
    it('should return 401 status code if the user is not found', async () => {
      // Arrange
      const credentials = {
        email: faker.internet.email(),
        password: 'password',
      }

      const api = treaty(authController())

      // Act
      const response = await api.auth.login.post(credentials)

      // Assert
      expect(response.status).toBe(401)
    })

    it('should return 401 status code if password is incorrect', async () => {
      // Arrange
      const registerCredentials = {
        email: faker.internet.email(),
        password: 'correctPassword123',
      }
      await Container.get(RegisterHandler).handle(registerCredentials)

      const loginCredentials = {
        email: registerCredentials.email,
        password: 'wrongPassword123',
      }
      const api = treaty(authController())

      // Act
      const response = await api.auth.login.post(loginCredentials)

      // Assert
      expect(response.status).toBe(401)
    })

    it('should return 422 status code if the body is missing', async () => {
      // Arrange
      const api = treaty(authController())

      // Act
      const response = await api.auth.login.post({} as any)

      // Assert
      expect(response.status).toBe(422)
    })

    it('should return 422 status code if the body is invalid', async () => {
      // Arrange
      const credentials = {
        email: 'invalid',
        password: 'password',
      }

      const api = treaty(authController())

      // Act
      const response = await api.auth.login.post(credentials)

      // Assert
      expect(response.status).toBe(422)
    })

    it('should return 200 status code if the user is found', async () => {
      // Arrange
      const credentials = {
        email: faker.internet.email(),
        password: 'password',
      }

      await Container.get(RegisterHandler).handle(credentials)

      const api = treaty(authController())

      // Act
      const response = await api.auth.login.post(credentials)

      // Assert
      expect(response.status).toBe(200)
      expect(response.data).toMatchObject({
        accessToken: expect.any(String),
      })
    })
  })

  describe('GET /refresh', () => {
    it('should return 401 status code if cookie is missing', async () => {
      // Arrange
      const api = treaty(authController())

      // Act
      const response = await api.auth.refresh.get()

      // Assert
      expect(response.status).toBe(401)
    })

    it('should return 401 status code if cookie is invalid', async () => {
      // Arrange
      const api = treaty(authController())

      // Act
      const response = await api.auth.refresh.get({
        headers: {
          Cookie: 'neko.refresh.token=invalid',
        },
      })

      // Assert
      expect(response.status).toBe(401)
    })

    it('should return 200 status code if cookie is valid', async () => {
      // Arrange
      const credentials = {
        email: faker.internet.email(),
        password: 'password',
      }

      const api = treaty(authController())

      await Container.get(RegisterHandler).handle(credentials)

      const { refreshToken } = await Container.get(LoginHandler).handle(credentials)

      // Act
      const response = await api.auth.refresh.get({
        headers: {
          Cookie: `neko.refresh.token=${refreshToken}`,
        },
      })

      // Assert
      expect(response.status).toBe(200)
      expect(response.data).toMatchObject({
        accessToken: expect.any(String),
      })
    })
  })
})
