import { PlaylistDto } from '@core/dto'
import { Playlist } from '@core/models'

export const mapPlaylistDtoToModel = (dto: PlaylistDto): Playlist => ({
  id: dto.id,
  name: dto.name,
  description: dto.description,
  type: dto.type,
  images: dto.images,
})
