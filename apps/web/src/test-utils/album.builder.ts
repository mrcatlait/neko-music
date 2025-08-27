import { faker } from '@faker-js/faker'

import { ALBUM_TYPES, ARTIST_ROLES } from '@/shared/enums'
import { Album } from '@/shared/entities'

export class AlbumBuilder {
  private album: Album

  constructor() {
    this.album = {
      id: faker.string.uuid(),
      title: faker.music.album(),
      releaseDate: faker.date.past().toISOString().split('T')[0],
      explicit: faker.datatype.boolean(),
      type: faker.helpers.arrayElement(Object.values(ALBUM_TYPES)),
      artists: faker.helpers.multiple(
        () => ({
          id: faker.string.uuid(),
          name: faker.music.artist(),
          role: faker.helpers.arrayElement(Object.values(ARTIST_ROLES)),
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
        url: faker.image.url({
          width: 256,
          height: 256,
        }),
        backgroundColor: faker.color.rgb(),
        textColor: faker.color.rgb(),
      },
    }
  }

  build() {
    return this.album
  }
}
