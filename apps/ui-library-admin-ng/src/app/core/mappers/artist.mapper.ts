import { ArtistDto } from '@core/dtos'
import { Artist } from '@core/interfaces'

export const mapArtistDtoToModel = (dto: ArtistDto): Artist => ({
  id: dto.id,
  name: dto.name,
  images: dto.images, // Assuming ImageDto and Image are compatible
  bio: dto.bio,
})
