import { faker } from '@faker-js/faker'

import { AlbumType, ArtistRole } from '@/shared/enums'
import { Album } from '@/shared/entities'

export class AlbumBuilder {
  private album: Album

  constructor() {
    this.album = {
      id: faker.string.uuid(),
      title: faker.music.album(),
      releaseDate: faker.date.past().toISOString().split('T')[0],
      explicit: faker.datatype.boolean(),
      type: faker.helpers.arrayElement(Object.values(AlbumType)),
      artists: faker.helpers.multiple(
        () => ({
          id: faker.string.uuid(),
          name: faker.music.artist(),
          role: faker.helpers.arrayElement(Object.values(ArtistRole)),
        }),
        {
          count: {
            min: 1,
            max: 5,
          },
        },
      ),
      genres: faker.helpers.multiple(() => faker.music.genre()),
      artwork: {
        url: faker.image.url({ width: 256, height: 256 }),
        sizes: ['small', 'medium', 'large'],
        bgColor: faker.color.rgb().replace('#', ''),
        textColor1: faker.color.rgb().replace('#', ''),
      },
    }
  }

  build() {
    return this.album
  }
}
