import Elysia, { t } from 'elysia'

import { PlaylistContainer } from '../playlist.container'
import { PlaylistType } from '../enums'

import { CollectionType } from '@common/enums'
import { authenticationPlugin } from '@features/authentication/plugins'
import { HttpException, InternalServerErrorException } from '@common/exceptions'
import { pageOptionsDto } from '@common/dto'

export const playlistController = new Elysia({
  prefix: '/playlists',
  detail: {
    tags: ['Playlists'],
  },
})
  .use(authenticationPlugin)
  .get(
    '/me',
    ({ user, query }) => {
      return PlaylistContainer.getPlaylistQueryService().getUserPlaylists({
        userId: user.id,
        pageOptionsDto: query,
      })
    },
    {
      authenticated: true,
      query: pageOptionsDto,
      detail: {
        summary: 'Get all playlists of the current user',
      },
    },
  )
  .get(
    '/me/collection-membership',
    ({ query: { itemId, itemType, offset, take }, user }) => {
      return PlaylistContainer.getPlaylistQueryService().getCollectionMembership({
        userId: user.id,
        itemId,
        itemType,
        pageOptionsDto: { offset, take },
      })
    },
    {
      authenticated: true,
      query: t.Object({
        itemId: t.String({ format: 'uuid' }),
        itemType: t.Enum(CollectionType),
        offset: t.Numeric({ minimum: 0 }),
        take: t.Numeric({ minimum: 1, maximum: 50 }),
      }),
      detail: {
        summary: "Get the membership of a collection in the current user's playlists",
      },
    },
  )
  .get(
    '/:playlistId',
    () => {
      return 'playlist'
    },
    {
      params: t.Object({
        playlistId: t.String({ format: 'uuid' }),
      }),
      authenticated: true,
      detail: {
        summary: 'Get a playlist by its ID',
      },
    },
  )
  .post(
    '/',
    ({ user, body }) => {
      return PlaylistContainer.getPlaylistCommandService().createPlaylist({
        userId: user.id,
        name: body.name,
        description: body.description,
        type: body.type,
      })
    },
    {
      body: t.Object({
        name: t.String(),
        description: t.String(),
        type: t.Enum(PlaylistType),
      }),
      authenticated: true,
      detail: {
        summary: 'Create a new playlist',
      },
    },
  )
  .delete(
    '/:playlistId',
    ({ params: { playlistId }, user }) => {
      return PlaylistContainer.getPlaylistCommandService().deletePlaylist({
        userId: user.id,
        playlistId,
      })
    },
    {
      params: t.Object({
        playlistId: t.String({ format: 'uuid' }),
      }),
      authenticated: true,
      detail: {
        summary: 'Delete a playlist by its ID',
      },
    },
  )
  .put(
    '/:playlistId',
    ({ params: { playlistId }, body, user }) => {
      return PlaylistContainer.getPlaylistCommandService().updatePlaylist({
        userId: user.id,
        playlistId,
        name: body.name,
        description: body.description,
        type: body.type,
      })
    },
    {
      params: t.Object({
        playlistId: t.String({ format: 'uuid' }),
      }),
      body: t.Object({
        name: t.String(),
        description: t.String(),
        type: t.Enum(PlaylistType),
      }),
      authenticated: true,
      detail: {
        summary: 'Update a playlist by its ID',
      },
    },
  )
  .get(
    '/:playlistId/tracks',
    ({ params: { playlistId }, query, user }) => {
      return PlaylistContainer.getPlaylistQueryService().getPlaylistTracks({
        userId: user.id,
        playlistId,
        pageOptionsDto: query,
      })
    },
    {
      authenticated: true,
      query: pageOptionsDto,
      detail: {
        summary: 'Get tracks by playlist',
      },
    },
  )
  .get(
    '/:playlistId/queue',
    ({ params: { playlistId }, user }) => {
      return PlaylistContainer.getPlaylistQueryService().getPlaylistQueueTracks({
        userId: user.id,
        playlistId,
      })
    },
    {
      authenticated: true,
      detail: {
        summary: 'Get queue tracks by playlist',
      },
    },
  )
  .post(
    '/:playlistId/tracks',
    ({ params: { playlistId }, body, user }) => {
      return PlaylistContainer.getPlaylistCommandService().addToPlaylist({
        userId: user.id,
        playlistId,
        itemId: body.itemId,
        itemType: body.itemType,
      })
    },
    {
      params: t.Object({
        playlistId: t.String({ format: 'uuid' }),
      }),
      body: t.Object({
        itemId: t.String(),
        itemType: t.Enum(CollectionType),
      }),
      authenticated: true,
      detail: {
        summary: 'Add tracks to a playlist',
      },
    },
  )
  .delete(
    '/:playlistId/tracks',
    ({ params: { playlistId }, body, user }) => {
      return PlaylistContainer.getPlaylistCommandService().removeFromPlaylist({
        userId: user.id,
        playlistId,
        trackId: body.trackId,
      })
    },
    {
      params: t.Object({
        playlistId: t.String({ format: 'uuid' }),
      }),
      body: t.Object({
        trackId: t.String(),
      }),
      authenticated: true,
      detail: {
        summary: 'Remove tracks from a playlist',
      },
    },
  )
  .put(
    '/:playlistId/tracks',
    ({ params: { playlistId }, body, user }) => {
      return PlaylistContainer.getPlaylistCommandService().reorderPlaylist({
        userId: user.id,
        playlistId,
        rangeStart: body.rangeStart,
        rangeEnd: body.rangeEnd,
        insertBefore: body.insertBefore,
      })
    },
    {
      params: t.Object({
        playlistId: t.String({ format: 'uuid' }),
      }),
      body: t.Object({
        rangeStart: t.Numeric({ minimum: 0 }),
        rangeEnd: t.Numeric({ minimum: 0 }),
        insertBefore: t.Numeric({ minimum: 0 }),
      }),
      authenticated: true,
      detail: {
        summary: 'Update the order of tracks in a playlist',
      },
    },
  )
  .onError(({ code, error }) => {
    if (error instanceof HttpException) {
      return error.response
    }

    if (code === 'INTERNAL_SERVER_ERROR' || code === 'UNKNOWN') {
      console.error(error)
      return new InternalServerErrorException().response
    }

    return error
  })
