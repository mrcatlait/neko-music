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
    return this.artist
  }
}
