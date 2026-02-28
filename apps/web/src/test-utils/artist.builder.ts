import { faker } from '@faker-js/faker'

import { Artist } from '@/shared/entities'

export class ArtistBuilder {
  private artist: Artist

  constructor() {
    this.artist = {
      id: faker.string.uuid(),
      name: faker.music.artist(),
      verified: faker.datatype.boolean(),
      artwork: {
        url: faker.image.url({ width: 256, height: 256 }),
        sizes: ['small', 'medium', 'large'],
        bgColor: faker.color.rgb().replace('#', ''),
        textColor1: faker.color.rgb().replace('#', ''),
      },
    }
  }

  build() {
    return this.artist
  }
}
