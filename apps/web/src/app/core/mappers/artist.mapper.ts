import { ArtistDto } from '@core/dto'
import { Artist } from '@core/models'

export const mapArtistDtoToModel = (dto: ArtistDto): Artist => ({
  id: dto.id,
  name: dto.name,
  images: dto.images, // Assuming ImageDto and Image are compatible
  bio: dto.bio,
})
