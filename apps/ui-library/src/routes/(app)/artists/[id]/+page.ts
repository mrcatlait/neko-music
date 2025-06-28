import { AlbumBuilder, ArtistBuilder } from '@/shared/test-utils'
import type { PageLoad } from './$types'

export const load: PageLoad = ({ params }) => {
  const { id } = params

  const artist = new ArtistBuilder().build()
  const albums = Array.from({ length: 3 }).map(() => new AlbumBuilder().build())

  return {
    artist,
    albums,
  }
}
