import { ScriptInterface } from '@common/services/types'

export class v20_CreateArtists implements ScriptInterface {
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

  private readonly images = [
    { resolution: '56x56', url: 'https://via.assets.so/album.png?id=1&q=95&w=56&h=56&fit=fill' },
    { resolution: '256x256', url: 'https://via.assets.so/album.png?id=1&q=95&w=256&h=256&fit=fill' },
    { resolution: '720x720', url: 'https://via.assets.so/album.png?id=1&q=95&w=720&h=720&fit=fill' },
  ]

  async up(): Promise<void> {
    // for (const name of this.artists) {
    //   const artist = await ArtistRepository.create({ name })
    //   for (const image of this.images) {
    //     await ArtistImageRepository.create({ ...image, artist_id: artist.id })
    //   }
    // }
  }

  async down(): Promise<void> {}
}
