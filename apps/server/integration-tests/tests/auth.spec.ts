import request from 'supertest'

import { app } from '../test-setup'

describe('Auth', () => {
  describe('POST /register', () => {
    it('should register a user', async () => {
      // Arrange
      const userData = { email: 'test@example.com', password: 'password123', displayName: 'Test User' }

      // Act
      const response = await request(app.getHttpServer()).post('/register').send(userData)

      // Assert
      expect(response.status).toBe(201)
      expect(response.body).toMatchObject({
        email: userData.email,
        displayName: userData.displayName,
      })
    })
  })
})
