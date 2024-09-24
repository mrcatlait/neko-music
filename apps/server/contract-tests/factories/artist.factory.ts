import { faker } from '@faker-js/faker'

import { ArtistEntity } from '@features/artist/entities'

export const artistFactory = (): ArtistEntity => {
  const artistMock: Omit<ArtistEntity, 'dtoClass' | 'toDto'> = {
    id: faker.string.uuid(),
    name: faker.string.sample(),
  }

  const artist = new ArtistEntity()
  Object.assign(artist, artistMock)

  return artist
}
