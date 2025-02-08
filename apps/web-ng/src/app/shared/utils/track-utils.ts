import { Queue, Track } from '@core/models'

export function generateCompositeTrackId(queue: Queue, track: Track | null): string {
  if (track && queue.source.entityId) {
    return `${queue.source.entityId}:${track.id}`
  }

  return ''
}
