import { faker } from '@faker-js/faker'

import { ArtistEntity, ArtistImageEntity } from '@modules/artist/entities'

export const artistImageFactory = (): ArtistImageEntity => {
  const artistImageMock: Omit<ArtistImageEntity, 'dtoClass' | 'toDto'> = {
    id: faker.string.uuid(),
    artistId: faker.string.uuid(),
    resolution: faker.string.sample(),
    url: faker.internet.url(),
    artist: {} as ArtistEntity,
  }

  const artistImage = new ArtistImageEntity()
  Object.assign(artistImage, artistImageMock)

  return artistImage
}
