import { faker } from '@faker-js/faker'

import { ArtistEntity, ArtistImageEntity } from '@modules/artist/entities'

export const artistImageFactory = (artist: ArtistEntity): ArtistImageEntity => {
  const artistImageMock: Omit<ArtistImageEntity, 'dtoClass' | 'toDto'> = {
    id: faker.string.uuid(),
    artistId: artist.id,
    resolution: faker.string.sample(),
    url: faker.internet.url(),
    artist,
  }

  const artistImage = new ArtistImageEntity()
  Object.assign(artistImage, artistImageMock)

  return artistImage
}
