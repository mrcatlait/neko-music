import request from 'supertest'
import { Contracts } from '@neko/contracts'
import { Context, Params } from 'integration-tests/utils'

import { app } from '../test-setup'

import { ACCESS_TOKEN_HEADER_NAME } from '@/modules/auth/constants'
import { RegisterUserUseCase } from '@/modules/auth/use-cases'

type GenreCreationOptions = Partial<Contracts.Backstage.GenreCreationRequest>

const getGenreCreationPayload = (
  context: Context,
  options: GenreCreationOptions = {},
): Contracts.Backstage.GenreCreationRequest => {
  const params = new Params<GenreCreationOptions>(context, options)

  return {
    name: params.alias('name', 'Rock'),
  }
}

describe('Backstage Genre', () => {
  let accessToken: string

  beforeAll(async () => {
    const session = await app.get(RegisterUserUseCase).invoke({
      email: 'backstage-genre@example.com',
      password: 'password123',
      displayName: 'Backstage Genre User',
    })

    accessToken = session.accessToken
  })

  describe('GET /backstage/genres', () => {
    let context: Context

    beforeEach(() => {
      context = new Context()
    })

    it('should successfully get all genres', async () => {
      // Arrange
      const payload = getGenreCreationPayload(context)
      const response = await request(app.getHttpServer())
        .post('/backstage/genres')
        .set(ACCESS_TOKEN_HEADER_NAME, `Bearer ${accessToken}`)
        .send(payload)

      // Assert
      expect(response.status).toBe(201)
      expect(response.body).toMatchObject({
        id: expect.any(String),
        name: payload.name,
      } as Contracts.Backstage.GenreCreationResponse)
    })

    it('should fail to create a genre if the name is not provided', async () => {
      // Arrange
      const payload = getGenreCreationPayload(context, { name: undefined })
      const response = await request(app.getHttpServer())
        .post('/backstage/genres')
        .set(ACCESS_TOKEN_HEADER_NAME, `Bearer ${accessToken}`)
        .send(payload)

      // Assert
      expect(response.status).toBe(400)
      expect(response.body).toMatchObject({ error: 'Bad Request' })
    })

    it('should fail to create a genre if the user is not authenticated', async () => {
      // Arrange
      const payload = getGenreCreationPayload(context)
      const response = await request(app.getHttpServer()).post('/backstage/genres').send(payload)

      // Assert
      expect(response.status).toBe(401)
      expect(response.body).toMatchObject({ message: 'Unauthorized', statusCode: 401 })
    })

    it('should fail to create a genre if the user does not have the required permissions', async () => {
      // Arrange
      const payload = getGenreCreationPayload(context)
      const response = await request(app.getHttpServer())
        .post('/backstage/genres')
        .set(ACCESS_TOKEN_HEADER_NAME, `Bearer ${accessToken}`)
        .send(payload)

      // Assert
      expect(response.status).toBe(403)
    })

    it('should fail to create a genre if name is not unique', async () => {
      // Arrange
      const payload = getGenreCreationPayload(context)
      await request(app.getHttpServer())
        .post('/backstage/genres')
        .set(ACCESS_TOKEN_HEADER_NAME, `Bearer ${accessToken}`)
        .send(payload)

      // Act
      const response = await request(app.getHttpServer())
        .post('/backstage/genres')
        .set(ACCESS_TOKEN_HEADER_NAME, `Bearer ${accessToken}`)
        .send(payload)

      // Assert
      expect(response.status).toBe(400)
      expect(response.body).toMatchObject({ error: 'Bad Request' })
    })
  })
})
