import { YoutubeAlbumResolver } from './youtube-album.resolver'
import { YoutubeArtistResolver } from './youtube-artist.resolver'
import { YoutubeGenreResolver } from './youtube-genre.resolver'
import { YtDlpMetadata } from './yt-dlp.model'
import { MetadataClaim } from '../../types'
import { YoutubeReleaseYearResolver } from './youtube-release-year.resolver'

export class YoutubeTrackResolver {
  constructor(
    private readonly genreResolver = new YoutubeGenreResolver(),
    private readonly artistResolver = new YoutubeArtistResolver(),
    private readonly albumResolver = new YoutubeAlbumResolver(),
    private readonly releaseYearResolver = new YoutubeReleaseYearResolver(),
  ) {}

  resolve(metadata: YtDlpMetadata): MetadataClaim[] {
    const title = metadata.track ?? metadata.title ?? metadata.id!
    const duration = metadata.duration
    const sourceUrl = metadata.webpage_url!

    const genres = this.genreResolver.resolve(metadata)
    const artists = this.artistResolver.resolve(metadata)
    const album = this.albumResolver.resolve(metadata)
    const releaseDate = this.releaseYearResolver.resolve(metadata)

    return [...genres, ...artists, album, releaseDate]
  }
}
