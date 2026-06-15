interface YtDlpPlaylistEntry {
  id?: string
  title?: string
}

/**
 * Metadata returned by yt-dlp for a flat playlist.
 */
export interface YtDlpFlatPlaylistMetadata {
  id?: string
  title: string
  entries?: YtDlpPlaylistEntry[]
}

/**
 * Common metadata fields returned by yt-dlp for a media item.
 */
export interface YtDlpGeneralMetadata {
  /** Video identifier. */
  id: string
  /** Video title. */
  title: string
  /** Video title without live timestamp or generic title suffixes. */
  fulltitle: string
  /** Video filename extension. */
  ext: string
  /** Secondary title of the video. */
  alt_title: string
  /** Video description. */
  description: string
  /** Alternative identifier for the video. */
  display_id: string
  /** Full name of the video uploader. */
  uploader: string
  /** Nickname or id of the video uploader. */
  uploader_id: string
  /** URL to the uploader profile. */
  uploader_url: string
  /** License name applied to the video. */
  license: string
  /** List of creators of the video. */
  creators: string[]
  /** Creators as comma-separated text. */
  creator: string
  /** UNIX timestamp when the video became available. */
  timestamp: number
  /** Upload date in UTC (YYYYMMDD). */
  upload_date: string
  /** UNIX timestamp when the video was released. */
  release_timestamp: number
  /** Release date in UTC (YYYYMMDD). */
  release_date: string
  /** Release year (YYYY). */
  release_year: number
  /** UNIX timestamp when the video was last modified. */
  modified_timestamp: number
  /** Last modified date in UTC (YYYYMMDD). */
  modified_date: string
  /** Full name of the channel. */
  channel: string
  /** Channel identifier. */
  channel_id: string
  /** Channel URL. */
  channel_url: string
  /** Number of channel followers. */
  channel_follower_count: number
  /** Whether the channel is verified. */
  channel_is_verified: boolean
  /** Physical location where the video was filmed. */
  location: string
  /** Video duration in seconds. */
  duration: number
  /** Video duration string (HH:mm:ss). */
  duration_string: string
  /** Total number of views. */
  view_count: number
  /** Number of users currently watching. */
  concurrent_view_count: number
  /** Number of likes. */
  like_count: number
  /** Number of dislikes. */
  dislike_count: number
  /** Number of reposts. */
  repost_count: number
  /** Average user rating. */
  average_rating: number
  /** Number of comments. */
  comment_count: number
  /** Number of saves/bookmarks. */
  save_count: number
  /** Age restriction in years. */
  age_limit: number
  /** Live state (e.g. not_live, is_live, is_upcoming, was_live, post_live). */
  live_status: string
  /** Whether this media is a live stream. */
  is_live: boolean
  /** Whether this media was originally live. */
  was_live: boolean
  /** Whether playback is allowed in embeds. */
  playable_in_embed: string
  /** Availability state (private, premium_only, subscriber_only, needs_auth, unlisted, public). */
  availability: string
  /** Media type as classified by the source (e.g. episode, clip, trailer). */
  media_type: string
  /** Start offset in seconds from source URL params. */
  start_time: number
  /** End offset in seconds from source URL params. */
  end_time: number
  /** Name of the yt-dlp extractor. */
  extractor: string
  /** Key name of the extractor. */
  extractor_key: string
  /** UNIX epoch when metadata extraction completed. */
  epoch: number
  /** Global download sequence number. */
  autonumber: number
  /** Sequence number incremented per video. */
  video_autonumber: number
  /** Total number of extracted entries in playlist context. */
  n_entries: number
  /** Parent playlist identifier. */
  playlist_id: string
  /** Parent playlist title. */
  playlist_title: string
  /** Playlist label (usually title, otherwise id). */
  playlist: string
  /** Total item count in playlist (when known). */
  playlist_count: number
  /** Position in playlist. */
  playlist_index: number
  /** Position in playlist download queue. */
  playlist_autonumber: number
  /** Full name of playlist uploader. */
  playlist_uploader: string
  /** Playlist uploader id or nickname. */
  playlist_uploader_id: string
  /** Display name of channel that uploaded the playlist. */
  playlist_channel: string
  /** Channel identifier that uploaded the playlist. */
  playlist_channel_id: string
  /** URL to the playlist webpage. */
  playlist_webpage_url: string
  /** Canonical webpage URL for the video. */
  webpage_url: string
  /** Basename of the webpage URL. */
  webpage_url_basename: string
  /** Domain of the webpage URL. */
  webpage_url_domain: string
  /** Original URL supplied by the user. */
  original_url: string
  /** Category labels for the media item. */
  categories: string[]
  /** Tag labels for the media item. */
  tags: string[]
  /** Cast members. */
  cast: string[]
}

/**
 * Track-specific metadata returned by yt-dlp.
 */
export interface YtDlpTrackMetadata {
  /** Title of the track. */
  track: string
  /** Position of the track within an album/disc. */
  track_number: number
  /** Track identifier. */
  track_id: string
  /** Track artists. */
  artists: string[]
  /** Track artists as comma-separated text. */
  artist: string
  /** Track genres. */
  genres: string[]
  /** Track genres as comma-separated text. */
  genre: string
  /** Composers of the track. */
  composers: string[]
  /** Composers as comma-separated text. */
  composer: string
  /** Album title. */
  album: string
  /** Album type. */
  album_type: string
  /** Album artists. */
  album_artists: string[]
  /** Album artists as comma-separated text. */
  album_artist: string
  /** Disc number within the release. */
  disc_number: number
}

/**
 * Unified yt-dlp metadata object with all known fields optional.
 */
export type YtDlpMetadata = Partial<YtDlpGeneralMetadata & YtDlpTrackMetadata>
