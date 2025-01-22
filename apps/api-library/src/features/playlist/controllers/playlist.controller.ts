import { Elysia } from 'elysia'

import { playlistsPageDto } from '../dtos'
import { GetUserPlaylistsQuery } from '../queries'

import { tracksPageDto } from '@features/music-metadata/dtos'
import { pageOptionsDto } from '@common/dtos'
import { Container } from '@common/di'

export const playlistController = () =>
  new Elysia({ prefix: '/playlists', detail: { tags: ['Playlist'] } })
    .decorate('getUserPlaylistsQuery', Container.get(GetUserPlaylistsQuery))
    .get(
      '/me',
      ({ getUserPlaylistsQuery, query }) =>
        getUserPlaylistsQuery.handle({ userId: '9916a5e0-6e97-461c-a22a-021fb8986efb', pageOptionsDto: query }),
      {
        detail: {
          summary: 'Get playlists of the current user',
        },
        query: pageOptionsDto,
        response: playlistsPageDto,
      },
    )
    // .get('/me/collection-membership', ({ getCollectionMembershipQuery }) => getCollectionMembershipQuery.handle(), {
    //   detail: {
    //     summary: "Get the membership of a collection in the current user's playlists",
    //   },
    //   response: collectionMembershipPageDto,
    // })
    // .get('/:playlistId', ({ getPlaylistByIdQuery }) => getPlaylistByIdQuery.handle(), {
    //   detail: {
    //     summary: 'Get a playlist by its ID',
    //   },
    //   response: playlistDto,
    // })
    // .post('/', ({ createPlaylistCommand }) => createPlaylistCommand.handle(), {
    //   detail: {
    //     summary: 'Create a new playlist',
    //   },
    //   response: playlistDto,
    // })

    // .delete('/:playlistId', ({ deletePlaylistCommand }) => deletePlaylistCommand.handle(), {
    //   detail: {
    //     summary: 'Delete a playlist by its ID',
    //   },
    // })
    // .put('/:playlistId', ({ updatePlaylistCommand }) => updatePlaylistCommand.handle(), {
    //   detail: {
    //     summary: 'Update a playlist by its ID',
    //   },
    //   response: playlistDto,
    // })
    .get('/:playlistId/tracks', ({ getPlaylistTracksQuery }) => getPlaylistTracksQuery.handle(), {
      detail: {
        summary: 'Get tracks by playlist',
      },
      response: tracksPageDto,
    })
// .post('/:playlistId/tracks', ({ addTracksToPlaylistCommand }) => addTracksToPlaylistCommand.handle(), {
//   detail: {
//     summary: 'Add tracks to a playlist',
//   },
// })
// .delete('/:playlistId/tracks', ({ removeTracksFromPlaylistCommand }) => removeTracksFromPlaylistCommand.handle(), {
//   detail: {
//     summary: 'Remove tracks from a playlist',
//   },
// })
// .put('/:playlistId/tracks', ({ reorderPlaylistTracksCommand }) => reorderPlaylistTracksCommand.handle(), {
//   detail: {
//     summary: 'Update the order of tracks in a playlist',
//   },
// })
