import { Static, t } from 'elysia'

import { PlaylistType } from '../enums'

import { imageDto } from '@common/dtos'

export const playlistDto = t.Object({
  id: t.String(),
  name: t.String(),
  type: t.Enum(PlaylistType),
  images: t.Array(imageDto),
})

export type PlaylistDto = Static<typeof playlistDto>
