import { t } from 'elysia'

export const imageDto = t.Object({
  resolution: t.String(),
  url: t.String(),
})

export type ImageDto = typeof imageDto.static
