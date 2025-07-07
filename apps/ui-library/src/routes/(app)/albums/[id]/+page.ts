import { AlbumBuilder, TrackBuilder } from '@/shared/test-utils'
import type { PageLoad } from './$types'

export const load: PageLoad = ({ params }) => {
  const { id } = params

  const album = new AlbumBuilder().build()
  const tracks = Array.from({ length: 20 }).map(() => new TrackBuilder().build())

  return {
    album,
    tracks,
  }
}
