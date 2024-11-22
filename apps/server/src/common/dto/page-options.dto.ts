import { t } from 'elysia'

export const pageOptionsDto = t.Object({
  offset: t.Numeric({ minimum: 0 }),
  take: t.Numeric({ minimum: 1, maximum: 50 }),
})

export type PageOptionsDto = typeof pageOptionsDto.static
