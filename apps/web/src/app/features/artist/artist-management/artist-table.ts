import { Injectable } from '@angular/core'

import { AgGridService } from '@/core/services'
import { Artist } from '@/shared/entities'

@Injectable()
export class ArtistTable extends AgGridService<Artist> {}
