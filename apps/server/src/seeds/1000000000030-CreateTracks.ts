import { In, QueryRunner } from 'typeorm'

import { SeedInterface } from '@core/seed/types'
import { TrackArtistEntity, TrackEntity, TrackImageEntity } from '@features/track/entities'
import { ArtistEntity } from '@features/artist/entities'
import { ArtistRole } from '@features/artist/models'

interface Track {
  title: string
  duration: number
  releaseData: Date
  artist: string
}

export class CreateTracks1000000000030 implements SeedInterface {
  readonly tracks: Track[] = [
    {
      title: 'Bad Romance',
      duration: 183,
      releaseData: new Date(),
      artist: 'Lady Gaga',
    },
  ]

  async up(queryRunner: QueryRunner): Promise<void> {
    const artistNames = [...new Set(this.tracks.map((track) => track.artist))]
    const artists = await queryRunner.manager.find(ArtistEntity, { where: { name: In(artistNames) } })

    const trackEntities = this.tracks.map((track) => {
      const artist = artists.find((a) => a.name === track.artist)

      if (!artist) {
        throw new Error(`Artist ${track.title} does not exist`)
      }

      return queryRunner.manager.create(TrackEntity, {
        title: track.title,
        duration: track.duration,
        releaseDate: track.releaseData,
        artists: [artist],
      })
    })

    await queryRunner.manager.save(trackEntities)

    const trackArtistsEntities = trackEntities
      .map((track) => {
        return track.artists.map((artist) =>
          queryRunner.manager.create(TrackArtistEntity, {
            trackId: track.id,
            artistId: artist.id,
            role: ArtistRole.PRIMARY,
          }),
        )
      })
      .flat()

    await queryRunner.manager.save(trackArtistsEntities)

    const images = [
      { resolution: '56x56', url: 'https://via.assets.so/album.png?id=1&q=95&w=56&h=56&fit=fill' },
      { resolution: '256x256', url: 'https://via.assets.so/album.png?id=1&q=95&w=256&h=256&fit=fill' },
      { resolution: '720x720', url: 'https://via.assets.so/album.png?id=1&q=95&w=720&h=720&fit=fill' },
    ]

    const trackImages = trackEntities
      .map((track) =>
        images.map((image) => queryRunner.manager.create(TrackImageEntity, { ...image, trackId: track.id })),
      )
      .flat()

    await queryRunner.manager.save(trackImages)
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    const tracks = await queryRunner.manager.find(TrackEntity, { where: { title: In(this.tracks) } })

    await queryRunner.manager.delete(TrackImageEntity, { trackId: In(tracks.map((track) => track.id)) })
    await queryRunner.manager.delete(TrackArtistEntity, { trackId: In(tracks.map((track) => track.id)) })
    await queryRunner.manager.delete(TrackEntity, { title: In(this.tracks) })
  }
}
