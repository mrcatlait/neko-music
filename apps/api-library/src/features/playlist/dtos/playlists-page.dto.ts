import { Static } from 'elysia'

import { playlistDto } from './playlist.dto'

import { pageDto } from '@common/dtos'

export const playlistsPageDto = pageDto(playlistDto)

export type PlaylistsPageDto = Static<typeof playlistsPageDto>
