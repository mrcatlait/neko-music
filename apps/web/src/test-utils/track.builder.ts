import { faker } from '@faker-js/faker'

import { ARTIST_ROLES } from '@/shared/enums'
import { Track } from '@/shared/entities'

export class TrackBuilder {
  private track: Track

  constructor() {
    this.track = {
      id: faker.string.uuid(),
      title: faker.music.songName(),
      duration: faker.number.int({ min: 100, max: 300 }),
      diskNumber: faker.number.int({ min: 1, max: 2 }),
      trackNumber: faker.number.int({ min: 1, max: 10 }),
      hasLyrics: faker.datatype.boolean(),
      explicit: faker.datatype.boolean(),
      releaseDate: faker.date.past().toISOString().split('T')[0],
      album: {
        id: faker.string.uuid(),
        name: faker.music.album(),
      },
      artists: faker.helpers.multiple(() => ({
        id: faker.string.uuid(),
        name: faker.music.artist(),
        role: faker.helpers.arrayElement(Object.values(ARTIST_ROLES)),
      })),
      genres: faker.helpers.multiple(() => faker.music.genre()),
      artwork: {
        url: faker.image.url({ width: 56, height: 56 }),
        sizes: ['small', 'medium', 'large'],
        bgColor: faker.color.rgb().replace('#', ''),
        textColor1: faker.color.rgb().replace('#', ''),
      },
    }
  }

  build() {
    return this.track
  }
}
