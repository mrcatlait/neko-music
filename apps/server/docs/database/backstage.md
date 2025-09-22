```mermaid
erDiagram
  Genre {
    uuid id PK
    string name UK
  }
  Genre many(0)--|| ArtistGenre : genreId
  Genre many(0)--|| AlbumGenre : genreId
  Genre many(0)--|| TrackGenre : genreId

  Artist {
    uuid id PK
    string name UK
    uuid catalogArtistId FK
    boolean verified
  }
  Artist ||--many(1) ArtistGenre : artistId
  Artist ||--1 ArtistArtwork : artistId
  Artist ||--many(1) AlbumArtist : artistId
  Artist ||--many(0) TrackArtist : artistId

  ArtistGenre {
    uuid artistId PK,FK
    uuid genreId PK,FK
    smallint position
  }

  ArtistArtwork {
    uuid artistId PK,FK
    uuid mediaAssetId FK
    string url
    string[] sizes
    string dominantColor
  }

  Album {
    uuid id PK
    uuid catalogAlbumId FK
    string name
    date releaseDate
    boolean explicit
    AlbumType type
  }
  Album ||--many(1) AlbumGenre : albumId
  Album ||--many(1) AlbumArtist : albumId
  Album ||--1 AlbumArtwork : albumId
  Album ||--many(0) Track : albumId

  AlbumGenre {
    uuid albumId PK,FK
    uuid genreId PK,FK
    smallint position
    boolean primary
  }

  AlbumArtist {
    uuid albumId PK,FK
    uuid artistId PK,FK
    ArtistRole role
  }

  AlbumArtwork {
    uuid albumId PK,FK
    uuid mediaAssetId FK
    string url
    string[] sizes
    string dominantColor
  }

  Track {
    uuid id PK
    uuid catalogTrackId FK
    string name
    date releaseDate
    TrackType type
    smallint duration
    boolean explicit
  }
  Track ||--many(1) TrackGenre : trackId
  Track ||--many(1) TrackArtist : trackId
  Track ||--1 TrackArtwork : trackId
  Track ||--1 TrackPlayback : trackId
  Track ||--1 TrackAlbum : trackId
  Track ||--1 Lyrics : trackId

  TrackGenre {
    uuid trackId PK,FK
    uuid genreId PK,FK
    smallint position
  }

  TrackArtist {
    uuid trackId PK,FK
    uuid artistId PK,FK
    ArtistRole role
  }

  TrackAlbum {
    uuid trackId PK,FK
    uuid albumId FK
    smallint trackNumber
    smallint diskNumber
  }

  TrackArtwork {
    uuid trackId PK,FK
    uuid mediaAssetId FK
    string url
    string[] sizes
    string dominantColor
  }

  TrackPlayback {
    uuid trackId PK,FK
    uuid mediaAssetId FK
    string url
  }

  Lyrics {
    uuid trackId PK,FK
    string lyrics
    boolean synced
  }
```