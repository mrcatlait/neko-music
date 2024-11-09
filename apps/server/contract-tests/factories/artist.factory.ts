import { faker } from '@faker-js/faker'

import { ArtistEntity } from '@modules/artist/entities'

export const artistFactory = (id?: string): ArtistEntity => {
  const artistMock: Omit<ArtistEntity, 'dtoClass' | 'toDto'> = {
    id: id ?? faker.string.uuid(),
    name: faker.string.sample(),
    bio: faker.string.sample(),
    images: [],
  }

  const artist = new ArtistEntity()
  Object.assign(artist, artistMock)

  return artist
}
