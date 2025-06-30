import { AlbumBuilder, ArtistBuilder, QueueBuilder, TrackBuilder } from '@/shared/test-utils'
import type { PageLoad } from './$types'

export const load: PageLoad = ({ params }) => {
  const { id } = params

  const artist = new ArtistBuilder().build()
  const albums = Array.from({ length: 3 }).map(() => new AlbumBuilder().build())
  const tracks = Array.from({ length: 20 }).map(() => new TrackBuilder().build())

  return {
    artist,
    albums,
    tracks,
  }
}
