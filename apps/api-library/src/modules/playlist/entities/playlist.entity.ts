import { PlaylistType } from '../enums'

import { ImageEntity } from '@modules/shared/entities'

export interface PlaylistEntity {
  id: string
  name: string
  description: string
  type: PlaylistType
  user_id: string
  images: ImageEntity[]
}
