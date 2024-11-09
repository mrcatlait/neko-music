import { PactV4 } from '@pact-foundation/pact'
import { firstValueFrom } from 'rxjs'
import { resolve } from 'path'

import { PlaylistRepository } from '@core/repositories'
import { repositoryProvider } from 'contract-tests/utils'
import {
  addPlaylistTrackDto,
  addPlaylistTrackRequestBody,
  createPlaylistDto,
  createPlaylistRequestBody,
  getMyPlaylistsSuccess,
  getMyPlaylistsSuccessResponseBody,
  getPlaylistSuccess,
  getPlaylistSuccessResponseBody,
  removePlaylistTrackDto,
  removePlaylistTrackRequestBody,
  updatePlaylistDto,
  updatePlaylistRequestBody,
  updatePlaylistTracksDto,
  updatePlaylistTracksRequestBody,
} from 'contract-tests/fixtures'

describe('Playlists', () => {
  const provider = new PactV4({
    logLevel: 'info',
    consumer: 'web',
    provider: 'music-library-api',
    dir: resolve(process.cwd(), '..', '..', 'contracts'),
  })

  const id = 'c76b4326-ca77-4c24-a414-f002c6be3106'

  describe('POST /playlists', () => {
    it('returns an HTTP 200', async () => {
      await provider
        .addInteraction()
        .given('authenticated user')
        .uponReceiving('a request to create a playlist')
        .withRequest('POST', '/playlists', (builder) => builder.jsonBody(createPlaylistRequestBody))
        .willRespondWith(200)
        .executeTest(async (mockServer) => {
          const repository = repositoryProvider(PlaylistRepository, mockServer)

          await firstValueFrom(repository.createPlaylist(createPlaylistDto)).then((response) => {
            expect(response).toBeDefined()
          })
        })
    })
  })

  describe('PUT /playlists/{id}', () => {
    it('returns an HTTP 200', async () => {
      await provider
        .addInteraction()
        .given('authenticated user')
        .given('has own playlist', { id })
        .uponReceiving('a request to update a playlist')
        .withRequest('PUT', `/playlists/${id}`, (builder) => builder.jsonBody(updatePlaylistRequestBody))
        .willRespondWith(200)
        .executeTest(async (mockServer) => {
          const repository = repositoryProvider(PlaylistRepository, mockServer)

          await firstValueFrom(repository.updatePlaylist(id, updatePlaylistDto)).then((response) => {
            expect(response).toBeDefined()
          })
        })
    })
  })

  describe('DELETE /playlists/{id}', () => {
    it('returns an HTTP 200', async () => {
      await provider
        .addInteraction()
        .given('authenticated user')
        .given('has own playlist', { id })
        .uponReceiving('a request to delete a playlist')
        .withRequest('DELETE', `/playlists/${id}`)
        .willRespondWith(200)
        .executeTest(async (mockServer) => {
          const repository = repositoryProvider(PlaylistRepository, mockServer)
          await firstValueFrom(repository.deletePlaylist(id)).then((response) => {
            expect(response).toBeDefined()
          })
        })
    })
  })

  describe('GET /playlists/{id}', () => {
    it('returns an HTTP 200 and a playlist', async () => {
      await provider
        .addInteraction()
        .given('authenticated user')
        .given('has own playlist', { id })
        .given('has tracks in playlist', { id })
        .uponReceiving('a request to get a playlist')
        .withRequest('GET', `/playlists/${id}`)
        .willRespondWith(200, (builder) => builder.jsonBody(getPlaylistSuccessResponseBody))
        .executeTest(async (mockServer) => {
          const repository = repositoryProvider(PlaylistRepository, mockServer)
          await firstValueFrom(repository.getPlaylist(id)).then((response) => {
            expect(response).toEqual(getPlaylistSuccess)
          })
        })
    })
  })

  describe('GET /playlists/me', () => {
    const take = 50
    const offset = 0

    it('returns an HTTP 200 and a list of playlists', async () => {
      await provider
        .addInteraction()
        .given('authenticated user')
        .given('has own playlist', { id })
        .given('has tracks in playlist', { id })
        .uponReceiving('a request to get my playlists')
        .withRequest('GET', '/playlists/me', (builder) => builder.query({ take: String(take), offset: String(offset) }))
        .willRespondWith(200, (builder) => builder.jsonBody(getMyPlaylistsSuccessResponseBody))
        .executeTest(async (mockServer) => {
          const repository = repositoryProvider(PlaylistRepository, mockServer)
          await firstValueFrom(repository.getMyPlaylists({ take, offset })).then((response) => {
            expect(response).toEqual(getMyPlaylistsSuccess)
          })
        })
    })
  })

  describe('POST /playlists/{id}/tracks', () => {
    it('returns an HTTP 200', async () => {
      await provider
        .addInteraction()
        .given('authenticated user')
        .given('has own playlist', { id })
        .uponReceiving('a request to add tracks to a playlist')
        .withRequest('POST', `/playlists/${id}/tracks`, (builder) => builder.jsonBody(addPlaylistTrackRequestBody))
        .willRespondWith(200)
        .executeTest(async (mockServer) => {
          const repository = repositoryProvider(PlaylistRepository, mockServer)

          await firstValueFrom(repository.addTracksToPlaylist(id, addPlaylistTrackDto)).then((response) => {
            expect(response).toBeDefined()
          })
        })
    })
  })

  describe('PUT /playlists/{id}/tracks', () => {
    it('returns an HTTP 200', async () => {
      await provider
        .addInteraction()
        .given('authenticated user')
        .given('has own playlist', { id })
        .uponReceiving('a request to update tracks in a playlist')
        .withRequest('PUT', `/playlists/${id}/tracks`, (builder) => builder.jsonBody(updatePlaylistTracksRequestBody))
        .willRespondWith(200)
        .executeTest(async (mockServer) => {
          const repository = repositoryProvider(PlaylistRepository, mockServer)

          await firstValueFrom(repository.updateTracksInPlaylist(id, updatePlaylistTracksDto)).then((response) => {
            expect(response).toBeDefined()
          })
        })
    })
  })

  describe('DELETE /playlists/{id}/tracks', () => {
    it('returns an HTTP 200', async () => {
      await provider
        .addInteraction()
        .given('authenticated user')
        .given('has own playlist', { id })
        .uponReceiving('a request to remove tracks from a playlist')
        .withRequest('DELETE', `/playlists/${id}/tracks`, (builder) => builder.jsonBody(removePlaylistTrackRequestBody))
        .willRespondWith(200)
        .executeTest(async (mockServer) => {
          const repository = repositoryProvider(PlaylistRepository, mockServer)

          await firstValueFrom(repository.removeTracksFromPlaylist(id, removePlaylistTrackDto)).then((response) => {
            expect(response).toBeDefined()
          })
        })
    })
  })
})
