import { CreateExtensions1000000000010 } from './1000000000010-CreateExtensions'
import { CreateArtistTable1000000000020 } from './1000000000020-CreateArtistTable'
import { CreateArtistImageTable1000000000030 } from './1000000000030-CreateArtistImageTable'
import { CreateAlbumTable1000000000040 } from './1000000000040-CreateAlbumTable'
import { CreateAlbumImageTable1000000000050 } from './1000000000050-CreateAlbumImageTable'
import { CreateTrackTable1000000000060 } from './1000000000060-CreateTrackTable'
import { CreateTrackImageTable1000000000070 } from './1000000000070-CreateTrackImageTable'
import { CreateGenreTable1000000000080 } from './1000000000080-CreateGenreTable'
import { CreateTrackGenreTable1000000000090 } from './1000000000090-CreateTrackGenreTable'
import { CreateTrackArtistTable1000000000100 } from './1000000000100-CreateTrackArtistTable'
import { CreatePlaylistTable1000000000110 } from './1000000000110-CreatePlaylistTable'
import { CreatePlaylistTrackTable1000000000120 } from './1000000000120-CreatePlaylistTrackTable'

export const migrations: any[] = [
  CreateExtensions1000000000010,
  CreateArtistTable1000000000020,
  CreateArtistImageTable1000000000030,
  CreateAlbumTable1000000000040,
  CreateAlbumImageTable1000000000050,
  CreateTrackTable1000000000060,
  CreateTrackImageTable1000000000070,
  CreateGenreTable1000000000080,
  CreateTrackGenreTable1000000000090,
  CreateTrackArtistTable1000000000100,
  CreatePlaylistTable1000000000110,
  CreatePlaylistTrackTable1000000000120,
]
