import { Static, t } from 'elysia'

import { imageDto } from '@common/dtos'

export const artistDto = t.Object({
  id: t.String({ format: 'uuid' }),
  name: t.String(),
  bio: t.Optional(t.String()),
  images: t.Array(imageDto),
})

export type ArtistDto = Static<typeof artistDto>
