import type { Track } from '../entities'
import type { QueueType } from '../enums'

export interface QueueMetadata {
  name: string
  description?: string
  type: QueueType
}

export interface QueueOptions {
  shuffle?: boolean
  startFromTrack?: string
}

export interface QueueResult {
  tracks: Track[]
  metadata: QueueMetadata
}

export abstract class Queue<TypeOptions, Options = TypeOptions & QueueOptions> {
  constructor(readonly options: Options = {} as Options) {}

  abstract get id(): string

  /**
   * Fetch tracks from the source
   */
  abstract fetchTracks(): Promise<Track[]>

  /**
   * Fetch metadata for the queue
   */
  abstract fetchMetadata(): Promise<QueueMetadata>

  /**
   * Get the complete queue result
   */
  async getResult(): Promise<QueueResult> {
    const [tracks, metadata] = await Promise.all([this.fetchTracks(), this.fetchMetadata()])

    return {
      tracks,
      metadata,
    }
  }
}
