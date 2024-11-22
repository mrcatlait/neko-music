import { Elysia, t } from 'elysia'

import { TrackContainer } from '../track.container'

import { authenticationPlugin } from '@features/authentication/plugins'

export const trackController = new Elysia({ prefix: '/tracks', detail: { tags: ['Tracks'] } })
  .use(authenticationPlugin)
  .get(
    '/new',
    () => {
      return TrackContainer.getTrackQueryService().getNewTracks()
    },
    {
      authenticated: true,
      detail: {
        summary: 'Get new tracks',
      },
    },
  )
  .get(
    '/popular',
    () => {
      return TrackContainer.getTrackQueryService().getPopularTracks()
    },
    {
      authenticated: true,
      detail: {
        summary: 'Get popular tracks',
      },
    },
  )
  .get(
    '/:trackId/stream/manifest',
    ({ params }) => {
      return TrackContainer.getTrackStreamingService().streamManifest(params.trackId)
    },
    {
      authenticated: true,
      params: t.Object({
        trackId: t.String({ format: 'uuid' }),
      }),
      detail: {
        summary: 'Get a track manifest',
        description: 'Retrieve a track manifest',
      },
    },
  )
  .get(
    '/:trackId/stream/:segmentId',
    ({ params }) => {
      return TrackContainer.getTrackStreamingService().streamSegment(params.trackId, params.segmentId)
    },
    {
      authenticated: true,
      params: t.Object({
        trackId: t.String({ format: 'uuid' }),
        segmentId: t.String(),
      }),
      detail: {
        summary: 'Get a track segment',
      },
    },
  )
