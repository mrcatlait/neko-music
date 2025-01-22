import { Elysia, t } from 'elysia'

import { artistDto, tracksPageDto } from '../dtos'
import { GetArtistQuery, GetArtistTracksQuery } from '../queries'

import { Container } from '@common/di'

export const artistController = () =>
  new Elysia({ prefix: '/artist', detail: { tags: ['Artist'] } })
    .decorate('getArtistQuery', Container.get(GetArtistQuery))
    .get('/:artistId', ({ getArtistQuery, params }) => getArtistQuery.handle(params), {
      detail: {
        summary: 'Get an artist by its ID',
      },
      params: t.Object({
        artistId: t.String({ format: 'uuid' }),
      }),
      response: artistDto,
    })
    .decorate('getArtistTracksQuery', Container.get(GetArtistTracksQuery))
    .get('/:artistId/tracks', ({ getArtistTracksQuery, params, query }) => getArtistTracksQuery.handle(params), {
      detail: {
        summary: 'Get an artist tracks by its ID',
      },
      params: t.Object({
        artistId: t.String({ format: 'uuid' }),
      }),
      response: tracksPageDto,
    })
// .post('/', ({ createArtistCommand }) => createArtistCommand.handle(), {
//   detail: {
//     summary: 'Create an artist',
//   },
//   body: createArtistDto,
//   response: artistDto,
// })
