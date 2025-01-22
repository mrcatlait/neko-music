import { Static, t } from 'elysia'

import { imageDto } from '@common/dtos'

export const trackDto = t.Object({
  id: t.String({ format: 'uuid' }),
  duration: t.Number(),
  title: t.String(),
  images: t.Array(imageDto),
})

export type TrackDto = Static<typeof trackDto>
