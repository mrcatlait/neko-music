import { Elysia } from 'elysia'

import { tracksPageDto } from '../dtos'
import { GetNewTracksQuery, GetPopularTracksHandler } from '../queries'

import { Container } from '@common/di'

export const trackController = () =>
  new Elysia({ prefix: '/tracks', detail: { tags: ['Track'] } })
    .decorate('getNewTracksQuery', Container.get(GetNewTracksQuery))
    .get('/new', async ({ getNewTracksQuery }) => getNewTracksQuery.handle(), {
      detail: {
        summary: 'Get new tracks',
      },
      response: tracksPageDto,
    })
    .decorate('getPopularTracksQuery', Container.get(GetPopularTracksHandler))
    .get('/popular', async ({ getPopularTracksQuery }) => getPopularTracksQuery.handle(), {
      detail: {
        summary: 'Get popular tracks',
      },
      response: tracksPageDto,
    })
