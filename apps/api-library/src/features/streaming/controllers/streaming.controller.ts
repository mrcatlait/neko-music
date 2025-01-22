import { Elysia, t } from 'elysia'

import { StreamingService } from '../services'

import { Container } from '@common/di'

export const streamingController = () =>
  new Elysia({ prefix: '/stream', detail: { tags: ['Stream'] } })
    .decorate('streamingService', Container.get(StreamingService))
    .get('/:trackId/manifest', ({ streamingService, params }) => streamingService.streamManifest(params.trackId), {
      params: t.Object({
        trackId: t.String({ format: 'uuid' }),
      }),
      detail: {
        summary: 'Get track manifest',
      },
    })
    .get(
      '/:trackId/:segmentId',
      ({ streamingService, params }) => streamingService.streamSegment(params.trackId, params.segmentId),
      {
        params: t.Object({
          trackId: t.String({ format: 'uuid' }),
          segmentId: t.String(),
        }),
        detail: {
          summary: 'Get track segment',
        },
      },
    )
