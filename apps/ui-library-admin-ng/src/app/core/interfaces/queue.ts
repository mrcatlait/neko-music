import { Track } from './track'

interface QueueSource {
  entityId?: string
  name: string
}

export interface Queue {
  source: QueueSource
  tracks: Track[]
}
