import { expect } from 'vitest'
import request from 'supertest'

import { app } from '../test-setup'
import { createUser } from '../helpers'

import { LoginUseCaseResult } from '@/modules/auth/use-cases'

describe('Backstage Genres', () => {
  let authenticatedUser: LoginUseCaseResult

  beforeAll(async () => {
    authenticatedUser = await createUser()
  })

  describe('POST /backstage/genres', () => {
    describe('when unauthenticated', () => {
      it('should return a 401 status code', () => {
        return request(app.getHttpServer()).post('/backstage/genres').send({ name: 'Rock' }).expect(401)
      })
    })

    describe('when authenticated', () => {
      it('should create a genre', async () => {
        // Arrange
        const genreData = { name: 'Rock' }

        // Act
        const response = await request(app.getHttpServer())
          .post('/backstage/genres')
          .set('Authorization', `Bearer ${authenticatedUser.accessToken}`)
          .send(genreData)

        // Assert
        expect(response.status).toBe(201)
        expect(response.body).toMatchObject({
          name: genreData.name,
        })
      })
    })
  })
})
