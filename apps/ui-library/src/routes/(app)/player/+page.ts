import { AlbumBuilder } from '@/shared/test-utils'
import type { PageLoad } from './$types'

export const load: PageLoad = () => {
  const albums = Array.from({ length: 12 }).map(() => new AlbumBuilder().build())

  return {
    albums,
  }
}
