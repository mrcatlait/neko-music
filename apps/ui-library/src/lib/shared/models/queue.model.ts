import type { QueueType } from '../enums'
import type { Track } from './track.model'

export interface Queue {
  id: string
  name: string
  type: QueueType
  tracks: Track[]
}
