import { CreateGenres1000000000010 } from './1000000000010-CreateGenres'
import { CreateArtists1000000000020 } from './1000000000020-CreateArtists'
import { CreateTracks1000000000030 } from './1000000000030-CreateTracks'

import { SeedClass } from '@modules/database-seed/types'

export const seeds: SeedClass[] = [CreateGenres1000000000010, CreateArtists1000000000020, CreateTracks1000000000030]
