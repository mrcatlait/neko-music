import request from 'supertest'
import { Contracts } from '@neko/contracts'

import { app } from '../test-setup'

import { Context, Params } from 'integration-tests/utils'
import { ACCESS_TOKEN_HEADER_NAME } from '@/modules/auth/constants'
import { LoginUseCase, RegisterUserUseCase } from '@/modules/auth/use-cases'

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
  let administratorAccessToken: string
  let userAccessToken: string

  beforeAll(async () => {
    const userSession = await app.get(RegisterUserUseCase).invoke({
      email: 'backstage-genre@example.com',
      password: 'password123',
      displayName: 'Backstage Genre User',
    })

    userAccessToken = userSession.accessToken

    const administratorSession = await app.get(LoginUseCase).invoke({
      email: 'admin@neko.com',
      password: 'password123',
    })

    administratorAccessToken = administratorSession.accessToken
  })

  describe('POST /backstage/genres', () => {
    let context: Context

    beforeEach(() => {
      context = new Context()
    })

    it('should successfully create a genre', async () => {
      // Arrange
      const payload = getGenreCreationPayload(context)
      const response = await request(app.getHttpServer())
        .post('/backstage/genres')
        .set(ACCESS_TOKEN_HEADER_NAME, `Bearer ${administratorAccessToken}`)
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
      const payload = { name: undefined }

      // Act
      const response = await request(app.getHttpServer())
        .post('/backstage/genres')
        .set(ACCESS_TOKEN_HEADER_NAME, `Bearer ${administratorAccessToken}`)
        .send(payload)

      // Assert
      expect(response.status).toBe(400)
      expect(response.body).toMatchObject({ error: 'Bad Request' })
    })

    it('should fail to create a genre if the user is not authenticated', async () => {
      // Arrange
      const payload = getGenreCreationPayload(context)

      // Act
      const response = await request(app.getHttpServer()).post('/backstage/genres').send(payload)

      // Assert
      expect(response.status).toBe(401)
      expect(response.body).toMatchObject({ message: 'Unauthorized', statusCode: 401 })
    })

    it('should fail to create a genre if the user does not have the required permissions', async () => {
      // Arrange
      const payload = getGenreCreationPayload(context)

      // Act
      const response = await request(app.getHttpServer())
        .post('/backstage/genres')
        .set(ACCESS_TOKEN_HEADER_NAME, `Bearer ${userAccessToken}`)
        .send(payload)

      // Assert
      expect(response.status).toBe(403)
    })

    it('should fail to create a genre if name is not unique', async () => {
      // Arrange
      const payload = getGenreCreationPayload(context)
      await request(app.getHttpServer())
        .post('/backstage/genres')
        .set(ACCESS_TOKEN_HEADER_NAME, `Bearer ${administratorAccessToken}`)
        .send(payload)

      // Act
      const response = await request(app.getHttpServer())
        .post('/backstage/genres')
        .set(ACCESS_TOKEN_HEADER_NAME, `Bearer ${administratorAccessToken}`)
        .send(payload)

      // Assert
      expect(response.status).toBe(400)
      expect(response.body).toMatchObject({ error: 'Bad Request' })
    })
  })

  describe('GET /backstage/genres', () => {
    let context: Context

    beforeEach(() => {
      context = new Context()
    })

    it('should successfully get all genres', async () => {
      // Arrange
      const payload = getGenreCreationPayload(context)
      await request(app.getHttpServer())
        .post('/backstage/genres')
        .set(ACCESS_TOKEN_HEADER_NAME, `Bearer ${administratorAccessToken}`)
        .send(payload)

      // Act
      const response = await request(app.getHttpServer())
        .get('/backstage/genres')
        .set(ACCESS_TOKEN_HEADER_NAME, `Bearer ${administratorAccessToken}`)

      // Assert
      expect(response.status).toBe(200)
      expect((response.body as Contracts.Backstage.GenresResponse).data).toContainEqual({
        id: expect.any(String),
        name: payload.name,
      } as Contracts.Backstage.Genre)
    })

    it('should fail to get all genres if the user is not authenticated', async () => {
      // Arrange & Act
      const response = await request(app.getHttpServer()).get('/backstage/genres')

      // Assert
      expect(response.status).toBe(401)
      expect(response.body).toMatchObject({ message: 'Unauthorized', statusCode: 401 })
    })

    it('should fail to get all genres if the user does not have the required permissions', async () => {
      // Arrange & Act
      const response = await request(app.getHttpServer())
        .get('/backstage/genres')
        .set(ACCESS_TOKEN_HEADER_NAME, `Bearer ${userAccessToken}`)

      // Assert
      expect(response.status).toBe(403)
    })
  })

  describe('GET /backstage/genres/:id', () => {
    let context: Context

    beforeEach(() => {
      context = new Context()
    })

    it('should successfully get a genre', async () => {
      // Arrange
      const payload = getGenreCreationPayload(context)
      const genreResponse = await request(app.getHttpServer())
        .post('/backstage/genres')
        .set(ACCESS_TOKEN_HEADER_NAME, `Bearer ${administratorAccessToken}`)
        .send(payload)

      const genreId = (genreResponse.body as Contracts.Backstage.GenreCreationResponse).id

      // Act
      const response = await request(app.getHttpServer())
        .get(`/backstage/genres/${genreId}`)
        .set(ACCESS_TOKEN_HEADER_NAME, `Bearer ${administratorAccessToken}`)

      // Assert
      expect(response.status).toBe(200)
      expect(response.body).toMatchObject({
        id: genreId,
        name: payload.name,
      } as Contracts.Backstage.Genre)
    })

    it('should fail to get a genre if the user is not authenticated', async () => {
      // Arrange & Act
      const response = await request(app.getHttpServer()).get('/backstage/genres/1')

      // Assert
      expect(response.status).toBe(401)
      expect(response.body).toMatchObject({ message: 'Unauthorized', statusCode: 401 })
    })

    it('should fail to get a genre if the user does not have the required permissions', async () => {
      // Arrange & Act
      const response = await request(app.getHttpServer())
        .get('/backstage/genres/1')
        .set(ACCESS_TOKEN_HEADER_NAME, `Bearer ${userAccessToken}`)

      // Assert
      expect(response.status).toBe(403)
    })

    it('should fail to get a genre if the genre does not exist', async () => {
      // Arrange & Act
      const response = await request(app.getHttpServer())
        .get('/backstage/genres/00000000-0000-0000-0000-000000000000')
        .set(ACCESS_TOKEN_HEADER_NAME, `Bearer ${administratorAccessToken}`)

      // Assert
      expect(response.status).toBe(404)
      expect(response.body).toMatchObject({ message: 'Genre not found', statusCode: 404 })
    })
  })

  describe('PUT /backstage/genres/:id', () => {
    let context: Context
    let genre: Contracts.Backstage.Genre

    beforeEach(async () => {
      context = new Context()

      const payload = getGenreCreationPayload(context, { name: 'Rock' })
      const genreResponse = await request(app.getHttpServer())
        .post('/backstage/genres')
        .set(ACCESS_TOKEN_HEADER_NAME, `Bearer ${administratorAccessToken}`)
        .send(payload)

      genre = genreResponse.body as Contracts.Backstage.GenreCreationResponse
    })

    it('should successfully update a genre', async () => {
      // Arrange
      const genreId = genre.id

      // Act
      const payload = getGenreCreationPayload(context, { name: 'Pop' })
      const response = await request(app.getHttpServer())
        .put(`/backstage/genres/${genreId}`)
        .set(ACCESS_TOKEN_HEADER_NAME, `Bearer ${administratorAccessToken}`)
        .send(payload)

      // Assert
      expect(response.status).toBe(200)
      expect(response.body).toMatchObject({
        id: genreId,
        name: payload.name,
      } as Contracts.Backstage.Genre)
    })

    it('should fail to update a genre if the user is not authenticated', async () => {
      // Arrange & Act
      const response = await request(app.getHttpServer()).put('/backstage/genres/1')

      // Assert
      expect(response.status).toBe(401)
      expect(response.body).toMatchObject({ message: 'Unauthorized', statusCode: 401 })
    })

    it('should fail to update a genre if the user does not have the required permissions', async () => {
      // Arrange & Act
      const response = await request(app.getHttpServer())
        .put('/backstage/genres/1')
        .set(ACCESS_TOKEN_HEADER_NAME, `Bearer ${userAccessToken}`)

      // Assert
      expect(response.status).toBe(403)
    })

    it('should fail to update a genre if the genre does not exist', async () => {
      // Arrange & Act
      const payload = getGenreCreationPayload(context, { name: 'Pop' })
      const response = await request(app.getHttpServer())
        .put('/backstage/genres/00000000-0000-0000-0000-000000000000')
        .set(ACCESS_TOKEN_HEADER_NAME, `Bearer ${administratorAccessToken}`)
        .send(payload)

      // Assert
      expect(response.status).toBe(400)
      expect(response.body).toMatchObject({ error: 'Bad Request' })
    })

    it('should fail to update a genre if the name is not provided', async () => {
      // Arrange & Act
      const response = await request(app.getHttpServer())
        .put(`/backstage/genres/${genre.id}`)
        .set(ACCESS_TOKEN_HEADER_NAME, `Bearer ${administratorAccessToken}`)
        .send({ name: undefined })

      // Assert
      expect(response.status).toBe(400)
      expect(response.body).toMatchObject({ error: 'Bad Request' })
    })

    it('should fail to update a genre if the name is not unique', async () => {
      // Arrange & Act
      const response = await request(app.getHttpServer())
        .put(`/backstage/genres/${genre.id}`)
        .set(ACCESS_TOKEN_HEADER_NAME, `Bearer ${administratorAccessToken}`)
        .send({ name: genre.name })

      // Assert
      expect(response.status).toBe(400)
      expect(response.body).toMatchObject({ error: 'Bad Request' })
    })
  })
})
