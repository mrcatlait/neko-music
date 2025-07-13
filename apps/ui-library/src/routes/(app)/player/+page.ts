import type { PageLoad } from './$types'

export const load: PageLoad = async ({ fetch }) => {
  const albumsResponse = await fetch(`http://localhost:3000/albums/popular`)

  const albums = await albumsResponse.json()

  console.log(albums)

  return {
    albums,
  }
}
