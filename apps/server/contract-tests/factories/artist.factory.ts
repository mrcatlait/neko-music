import { faker } from '@faker-js/faker'

import { artistImageFactory } from './artist-image.factory'

import { ArtistEntity } from '@modules/artist/entities'

export const artistFactory = (): ArtistEntity => {
  const artistMock: Omit<ArtistEntity, 'dtoClass' | 'toDto'> = {
    id: faker.string.uuid(),
    name: faker.string.sample(),
    bio: faker.string.sample(),
    images: [artistImageFactory()],
  }

  const artist = new ArtistEntity()
  Object.assign(artist, artistMock)

  return artist
}
