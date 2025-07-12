import type { Track } from '../entities'
import { Queue, type QueueMetadata } from './queue.model'

export interface GenericQueueOptions {
  tracks: Track[]
  metadata: QueueMetadata
}

export class GenericQueue extends Queue<GenericQueueOptions> {
  get id(): string {
    return `generic-${this.options.metadata.name.toLowerCase().replace(/\s+/g, '-')}`
  }

  async fetchTracks(): Promise<Track[]> {
    return this.options.tracks
  }

  async fetchMetadata(): Promise<QueueMetadata> {
    return this.options.metadata
  }
}
