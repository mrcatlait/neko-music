import { TrackDto } from '@core/dtos'
import { Track } from '@core/interfaces'

export const mapTrackDtoToModel = (dto: TrackDto): Track => ({
  id: dto.id,
  title: dto.title,
  images: dto.images, // Assuming ImageDto and Image are compatible
  artists: dto.artists.map((artist) => ({ id: artist.id, name: artist.name, role: artist.role })), // Adjust as necessary
  duration: dto.duration,
  genres: dto.genres,
})
