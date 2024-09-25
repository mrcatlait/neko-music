import { Track } from './track.model'

interface QueueSource {
  entityId?: string
  name: string
}

export interface Queue {
  source: QueueSource
  tracks: Track[]
}
