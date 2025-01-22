import { Static } from 'elysia'

import { trackDto } from './track.dto'

import { pageDto } from '@common/dtos'

export const tracksPageDto = pageDto(trackDto)

export type TracksPageDto = Static<typeof tracksPageDto>
