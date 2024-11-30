import { ScriptInterface } from '@common/services/types'

interface Track {
  title: string
  duration: number
  releaseData: Date
  artist: string
}

export class v30_CreateTracks implements ScriptInterface {
  readonly tracks: Track[] = [
    {
      title: 'Bad Romance',
      duration: 183,
      releaseData: new Date(),
      artist: 'Lady Gaga',
    },
    {
      title: 'Poker Face',
      duration: 214,
      releaseData: new Date(),
      artist: 'Lady Gaga',
    },
    {
      title: 'Telephone',
      duration: 221,
      releaseData: new Date(),
      artist: 'Lady Gaga',
    },
  ]

  private readonly images = [
    { resolution: '56x56', url: 'https://via.assets.so/album.png?id=1&q=95&w=56&h=56&fit=fill' },
    { resolution: '256x256', url: 'https://via.assets.so/album.png?id=1&q=95&w=256&h=256&fit=fill' },
    { resolution: '720x720', url: 'https://via.assets.so/album.png?id=1&q=95&w=720&h=720&fit=fill' },
  ]

  async up(): Promise<void> {
    // for (const track of this.tracks) {
    //   const artist = await ArtistRepository.findOneByName(track.artist)
    //   if (!artist) {
    //     throw new Error(`Artist ${track.artist} does not exist`)
    //   }
    //   const createdTrack = await TrackRepository.create({
    //     title: track.title,
    //     duration: track.duration,
    //     release_data: track.releaseData,
    //   })
    //   await TrackArtistRepository.create({
    //     track_id: createdTrack.id,
    //     artist_id: artist.id,
    //     role: 'primary',
    //   })
    //   for (const image of this.images) {
    //     await TrackImageRepository.create({
    //       resolution: image.resolution,
    //       url: image.url,
    //       track_id: createdTrack.id,
    //     })
    //   }
    // }
  }

  async down(): Promise<void> {}
}
