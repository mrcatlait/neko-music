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
    JSONB artwork
    boolean verified
  }
  Artist ||--many(1) ArtistGenre : artistId
  Artist ||--many(1) AlbumArtist : artistId
  Artist ||--many(0) TrackArtist : artistId

  ArtistGenre {
    uuid artistId PK,FK
    uuid genreId PK,FK
    smallint position
  }

  Album {
    uuid id PK
    string name
    date releaseDate
    boolean explicit
    JSONB artwork
    AlbumType type
  }
  Album ||--many(1) AlbumGenre : albumId
  Album ||--many(1) AlbumArtist : albumId
  Album ||--many(0) Track : albumId

  AlbumGenre {
    uuid albumId PK,FK
    uuid genreId PK,FK
    smallint position
  }

  AlbumArtist {
    uuid albumId PK,FK
    uuid artistId PK,FK
    ArtistRole role
  }

  Track {
    uuid id PK
    string name
    uuid albumId FK
    smallint trackNumber
    smallint diskNumber
    date releaseDate
    TrackType type
    uuid originalTrackId FK
    smallint duration
    JSONB artwork
    JSONB playback
    boolean explicit
  }
  Track ||--many(1) TrackGenre : trackId
  Track ||--many(1) TrackArtist : trackId
  Track ||--zero or one Lyrics : trackId

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

  Lyrics {
    uuid trackId PK,FK
    string lyrics
    boolean synced
  }
```