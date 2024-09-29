import { In, QueryRunner } from 'typeorm'

import { ArtistEntity, ArtistImageEntity } from '@features/artist/entities'
import { SeedInterface } from '@core/seed/types'

export class CreateArtists1000000000020 implements SeedInterface {
  private readonly artists = [
    'Linkin Park',
    'Eminem',
    'Rihanna',
    'Coldplay',
    'Beyonce',
    'Lady Gaga',
    'Taylor Swift',
    'Ariana Grande',
    'Dua Lipa',
  ]

  async up(queryRunner: QueryRunner): Promise<void> {
    const artistEntities = this.artists.map((name) =>
      queryRunner.manager.create(ArtistEntity, {
        name,
      }),
    )
    await queryRunner.manager.save(artistEntities)

    const images = [
      { resolution: '56x56', url: 'https://via.assets.so/album.png?id=1&q=95&w=56&h=56&fit=fill' },
      { resolution: '256x256', url: 'https://via.assets.so/album.png?id=1&q=95&w=256&h=256&fit=fill' },
      { resolution: '720x720', url: 'https://via.assets.so/album.png?id=1&q=95&w=720&h=720&fit=fill' },
    ]

    const artistImages = artistEntities
      .map((artist) =>
        images.map((image) => queryRunner.manager.create(ArtistImageEntity, { ...image, artistId: artist.id })),
      )
      .flat()

    await queryRunner.manager.save(artistImages)
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    const artists = await queryRunner.manager.find(ArtistEntity, { where: { name: In(this.artists) } })

    await queryRunner.manager.delete(ArtistImageEntity, { artistId: In(artists.map((artist) => artist.id)) })
    await queryRunner.manager.delete(ArtistEntity, { name: In(this.artists) })
  }
}
