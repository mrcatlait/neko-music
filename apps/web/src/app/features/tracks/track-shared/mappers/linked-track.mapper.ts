import { LinkedTrack } from '../interfaces'

import { generateCompositeTrackId } from '@shared/utils'
import { Queue, Track } from '@core/interfaces'

export const mapTrackToLinkedTrack = (track: Track, queue: Queue): LinkedTrack => ({
  ...track,
  linkedTrackId: generateCompositeTrackId(queue, track),
})
