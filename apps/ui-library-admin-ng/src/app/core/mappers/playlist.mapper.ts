import { PlaylistDto } from '@core/dtos'
import { Playlist } from '@core/interfaces'

export const mapPlaylistDtoToModel = (dto: PlaylistDto): Playlist => ({
  id: dto.id,
  name: dto.name,
  description: dto.description,
  type: dto.type,
  images: dto.images,
})
