import request from 'supertest'
import { Contracts } from '@neko/contracts'

import { app } from '../test-setup'
import { Context, Params } from '../utils'

import { ACCESS_TOKEN_HEADER_NAME } from '@/modules/auth/constants'
import { LoginUseCase, RegisterUserUseCase } from '@/modules/auth/use-cases'

type ArtistRequestOptions = Partial<
  Contracts.Backstage.Artists.CreationRequest | Contracts.Backstage.Artists.UpdateRequest
>

const getArtistPayload = (
  context: Context,
  genreIds: string[],
  options: ArtistRequestOptions = {},
): Contracts.Backstage.Artists.CreationRequest => {
  const params = new Params<ArtistRequestOptions>(context, options)

  return {
    name: params.alias('name', 'Test Artist'),
    genres: genreIds,
    verified: options.verified ?? true,
  }
}

describe('Backstage Artist', () => {
  let administratorAccessToken: string
  let userAccessToken: string
  let genreIds: string[]

  beforeAll(async () => {
    const userSession = await app.get(RegisterUserUseCase).invoke({
      email: 'backstage-artist@example.com',
      password: 'password123',
      displayName: 'Backstage Artist User',
    })

    userAccessToken = userSession.accessToken

    const administratorSession = await app.get(LoginUseCase).invoke({
      email: 'admin@neko.com',
      password: 'password123',
    })

    administratorAccessToken = administratorSession.accessToken

    const genreContext = new Context()
    const genrePayload = { name: genreContext.alias('Rock') }
    const genreResponse = await request(app.getHttpServer())
      .post('/backstage/genres')
      .set(ACCESS_TOKEN_HEADER_NAME, `Bearer ${administratorAccessToken}`)
      .send(genrePayload)

    genreIds = [(genreResponse.body as Contracts.Backstage.Genres.CreationResponse).id]
  })

  describe('POST /backstage/artists', () => {
    let context: Context

    beforeEach(() => {
      context = new Context()
    })

    it('should successfully create an artist', async () => {
      // Arrange
      const payload = getArtistPayload(context, genreIds)
      const response = await request(app.getHttpServer())
        .post('/backstage/artists')
        .set(ACCESS_TOKEN_HEADER_NAME, `Bearer ${administratorAccessToken}`)
        .send(payload)

      // Assert
      expect(response.status).toBe(201)
      expect(response.body).toMatchObject({
        artistId: expect.any(String),
        uploadToken: expect.any(String),
      } as Contracts.Backstage.Artists.CreationResponse)
    })

    it('should fail to create an artist if the name is not provided', async () => {
      // Arrange
      const payload = { name: undefined, genres: genreIds, verified: true }

      // Act
      const response = await request(app.getHttpServer())
        .post('/backstage/artists')
        .set(ACCESS_TOKEN_HEADER_NAME, `Bearer ${administratorAccessToken}`)
        .send(payload)

      // Assert
      expect(response.status).toBe(400)
      expect(response.body).toMatchObject({ error: 'Bad Request' })
    })

    it('should fail to create an artist if genres is empty', async () => {
      // Arrange
      const payload = { name: 'Test Artist', genres: [], verified: true }

      // Act
      const response = await request(app.getHttpServer())
        .post('/backstage/artists')
        .set(ACCESS_TOKEN_HEADER_NAME, `Bearer ${administratorAccessToken}`)
        .send(payload)

      // Assert
      expect(response.status).toBe(400)
      expect(response.body).toMatchObject({ error: 'Bad Request' })
    })

    it('should fail to create an artist if the user is not authenticated', async () => {
      // Arrange
      const payload = getArtistPayload(context, genreIds)

      // Act
      const response = await request(app.getHttpServer()).post('/backstage/artists').send(payload)

      // Assert
      expect(response.status).toBe(401)
      expect(response.body).toMatchObject({ message: 'Unauthorized', statusCode: 401 })
    })

    it('should fail to create an artist if the user does not have the required permissions', async () => {
      // Arrange
      const payload = getArtistPayload(context, genreIds)

      // Act
      const response = await request(app.getHttpServer())
        .post('/backstage/artists')
        .set(ACCESS_TOKEN_HEADER_NAME, `Bearer ${userAccessToken}`)
        .send(payload)

      // Assert
      expect(response.status).toBe(403)
    })

    it('should fail to create an artist if name is not unique', async () => {
      // Arrange
      const payload = getArtistPayload(context, genreIds)
      await request(app.getHttpServer())
        .post('/backstage/artists')
        .set(ACCESS_TOKEN_HEADER_NAME, `Bearer ${administratorAccessToken}`)
        .send(payload)

      // Act
      const response = await request(app.getHttpServer())
        .post('/backstage/artists')
        .set(ACCESS_TOKEN_HEADER_NAME, `Bearer ${administratorAccessToken}`)
        .send(payload)

      // Assert
      expect(response.status).toBe(400)
      expect(response.body).toMatchObject({ error: 'Bad Request' })
    })

    it('should fail to create an artist if genres do not exist', async () => {
      // Arrange
      const payload = getArtistPayload(context, ['00000000-0000-0000-0000-000000000000'])

      // Act
      const response = await request(app.getHttpServer())
        .post('/backstage/artists')
        .set(ACCESS_TOKEN_HEADER_NAME, `Bearer ${administratorAccessToken}`)
        .send(payload)

      // Assert
      expect(response.status).toBe(400)
      expect(response.body).toMatchObject({ error: 'Bad Request' })
    })
  })

  describe('GET /backstage/artists/:id', () => {
    let context: Context

    beforeEach(() => {
      context = new Context()
    })

    it('should successfully get an artist', async () => {
      // Arrange
      const payload = getArtistPayload(context, genreIds)
      const genreResponse = await request(app.getHttpServer())
        .post('/backstage/genres')
        .set(ACCESS_TOKEN_HEADER_NAME, `Bearer ${administratorAccessToken}`)
        .send({ name: context.alias('Rock') })

      genreIds = [(genreResponse.body as Contracts.Backstage.Genres.CreationResponse).id]

      const response = await request(app.getHttpServer())
        .post('/backstage/artists')
        .set(ACCESS_TOKEN_HEADER_NAME, `Bearer ${administratorAccessToken}`)
        .send(payload)

      // Assert
      expect(response.status).toBe(201)
      expect(response.body).toMatchObject({
        artistId: expect.any(String),
        uploadToken: expect.any(String),
      } as Contracts.Backstage.Artists.CreationResponse)
    })

    it('should fail to get an artist if the user is not authenticated', async () => {
      // Arrange & Act
      const response = await request(app.getHttpServer()).get('/backstage/artists/00000000-0000-0000-0000-000000000000')

      // Assert
      expect(response.status).toBe(401)
      expect(response.body).toMatchObject({ message: 'Unauthorized', statusCode: 401 })
    })

    it('should fail to get an artist if the user does not have the required permissions', async () => {
      // Arrange & Act
      const response = await request(app.getHttpServer())
        .get('/backstage/artists/00000000-0000-0000-0000-000000000000')
        .set(ACCESS_TOKEN_HEADER_NAME, `Bearer ${userAccessToken}`)

      // Assert
      expect(response.status).toBe(403)
    })

    it('should fail to get an artist if the artist does not exist', async () => {
      // Arrange & Act
      const response = await request(app.getHttpServer())
        .get('/backstage/artists/00000000-0000-0000-0000-000000000000')
        .set(ACCESS_TOKEN_HEADER_NAME, `Bearer ${administratorAccessToken}`)

      // Assert
      expect(response.status).toBe(404)
      expect(response.body).toMatchObject({ message: 'Artist not found', statusCode: 404 })
    })
  })

  describe('PUT /backstage/artists/:id', () => {
    let context: Context
    let artistId: string

    beforeEach(async () => {
      context = new Context()

      const payload = getArtistPayload(context, genreIds, { name: 'Original Artist' })
      const artistResponse = await request(app.getHttpServer())
        .post('/backstage/artists')
        .set(ACCESS_TOKEN_HEADER_NAME, `Bearer ${administratorAccessToken}`)
        .send(payload)

      artistId = (artistResponse.body as Contracts.Backstage.Artists.CreationResponse).artistId
    })

    it('should successfully update an artist', async () => {
      // Arrange
      const payload = getArtistPayload(context, genreIds)
      const artistResponse = await request(app.getHttpServer())
        .post('/backstage/artists')
        .set(ACCESS_TOKEN_HEADER_NAME, `Bearer ${administratorAccessToken}`)
        .send(payload)
      const artist = artistResponse.body as Contracts.Backstage.Artists.CreationResponse

      // Act
      const response = await request(app.getHttpServer())
        .put(`/backstage/artists/${artist.artistId}`)
        .set(ACCESS_TOKEN_HEADER_NAME, `Bearer ${administratorAccessToken}`)
        .send(payload)

      // Assert
      expect(response.status).toBe(200)
      expect(response.body).toMatchObject({
        uploadToken: expect.any(String),
      } as Contracts.Backstage.Artists.UpdateResponse)
    })

    it('should fail to update an artist if the user is not authenticated', async () => {
      // Arrange & Act
      const payload = getArtistPayload(context, genreIds)
      const response = await request(app.getHttpServer()).put(`/backstage/artists/${artistId}`).send(payload)

      // Assert
      expect(response.status).toBe(401)
      expect(response.body).toMatchObject({ message: 'Unauthorized', statusCode: 401 })
    })

    it('should fail to update an artist if the user does not have the required permissions', async () => {
      // Arrange & Act
      const payload = getArtistPayload(context, genreIds)
      const response = await request(app.getHttpServer())
        .put(`/backstage/artists/${artistId}`)
        .set(ACCESS_TOKEN_HEADER_NAME, `Bearer ${userAccessToken}`)
        .send(payload)

      // Assert
      expect(response.status).toBe(403)
    })

    it('should fail to update an artist if the artist does not exist', async () => {
      // Arrange & Act
      const payload = getArtistPayload(context, genreIds)
      const response = await request(app.getHttpServer())
        .put('/backstage/artists/00000000-0000-0000-0000-000000000000')
        .set(ACCESS_TOKEN_HEADER_NAME, `Bearer ${administratorAccessToken}`)
        .send(payload)

      // Assert
      expect(response.status).toBe(400)
      expect(response.body).toMatchObject({ error: 'Bad Request' })
    })

    it('should fail to update an artist if the name is not provided', async () => {
      // Arrange & Act
      const response = await request(app.getHttpServer())
        .put(`/backstage/artists/${artistId}`)
        .set(ACCESS_TOKEN_HEADER_NAME, `Bearer ${administratorAccessToken}`)
        .send({ name: undefined, genres: genreIds, verified: true })

      // Assert
      expect(response.status).toBe(400)
      expect(response.body).toMatchObject({ error: 'Bad Request' })
    })

    it('should fail to update an artist if genres do not exist', async () => {
      // Arrange & Act
      const payload = getArtistPayload(context, ['00000000-0000-0000-0000-000000000000'])
      const response = await request(app.getHttpServer())
        .put(`/backstage/artists/${artistId}`)
        .set(ACCESS_TOKEN_HEADER_NAME, `Bearer ${administratorAccessToken}`)
        .send(payload)

      // Assert
      expect(response.status).toBe(400)
      expect(response.body).toMatchObject({ error: 'Bad Request' })
    })
  })

  describe('GET /backstage/artists/statistics', () => {
    it('should successfully get artist statistics', async () => {
      // Arrange & Act
      const response = await request(app.getHttpServer())
        .get('/backstage/artists/statistics')
        .set(ACCESS_TOKEN_HEADER_NAME, `Bearer ${administratorAccessToken}`)

      // Assert
      expect(response.status).toBe(200)
      expect(response.body).toMatchObject({
        data: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
            status: expect.any(String),
            totalAlbums: expect.any(Number),
            totalTracks: expect.any(Number),
          }),
        ]),
      } as Contracts.Backstage.Artists.StatisticsResponse)
    })

    it('should fail to get artist statistics if the user is not authenticated', async () => {
      // Arrange & Act
      const response = await request(app.getHttpServer()).get('/backstage/artists/statistics')

      // Assert
      expect(response.status).toBe(401)
      expect(response.body).toMatchObject({ message: 'Unauthorized', statusCode: 401 })
    })

    it('should fail to get artist statistics if the user does not have the required permissions', async () => {
      // Arrange & Act
      const response = await request(app.getHttpServer())
        .get('/backstage/artists/statistics')
        .set(ACCESS_TOKEN_HEADER_NAME, `Bearer ${userAccessToken}`)

      // Assert
      expect(response.status).toBe(403)
    })
  })
})
