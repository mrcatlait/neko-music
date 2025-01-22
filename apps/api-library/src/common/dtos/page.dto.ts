import { TSchema, t } from 'elysia'

import { pageMetaDto } from './page-meta.dto'

export const pageDto = <T extends TSchema>(dataType: T) =>
  t.Object({
    data: t.Array(dataType),
    meta: pageMetaDto,
  })
