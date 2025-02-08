import { LinkedTrack } from '../models'

import { Queue, Track } from '@core/models'
import { generateCompositeTrackId } from '@shared/utils'

export const mapTrackToLinkedTrack = (track: Track, queue: Queue): LinkedTrack => ({
  ...track,
  linkedTrackId: generateCompositeTrackId(queue, track),
})
