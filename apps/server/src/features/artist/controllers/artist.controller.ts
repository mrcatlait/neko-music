import { Elysia, t } from 'elysia'

import { ArtistContainer } from '../artist.container'

import { pageOptionsDto } from '@common/dto'
import { authenticationPlugin } from '@features/authentication/plugins'

export const artistController = new Elysia({ prefix: '/artists', detail: { tags: ['Artists'] } })
  .use(authenticationPlugin)
  .get(
    '/:artistId',
    ({ params: { artistId } }) => {
      return ArtistContainer.getArtistQueryService().getArtist({ artistId })
    },
    {
      authenticated: true,
      params: t.Object({
        artistId: t.String(),
      }),
      detail: {
        summary: 'Get artist by id',
      },
    },
  )
  .get(
    '/:artistId/tracks',
    ({ query, params }) => {
      return ArtistContainer.getArtistQueryService().getArtistTracks({
        artistId: params.artistId,
        pageOptionsDto: query,
      })
    },
    {
      query: pageOptionsDto,
      authenticated: true,
      detail: {
        summary: 'Get tracks by artist',
      },
    },
  )
  .get(
    '/:artistId/queue',
    ({ params }) => {
      return ArtistContainer.getArtistQueryService().getArtistQueueTracks({
        artistId: params.artistId,
      })
    },
    {
      authenticated: true,
      detail: {
        summary: 'Get all queue tracks by artist',
      },
    },
  )
