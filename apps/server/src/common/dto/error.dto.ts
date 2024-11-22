import { t } from 'elysia'

export const errorDto = t.Object({
  status: t.String(),
  message: t.String(),
})

export type ErrorDto = typeof errorDto.static
