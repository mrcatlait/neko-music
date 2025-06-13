import type { Queue, Track } from '@/shared/models'
import { faker } from '@faker-js/faker'
import { QUEUE_TYPES } from '../enums'
import { TrackBuilder } from './track.builder'

export class QueueBuilder {
  private queue: Queue

  constructor() {
    this.queue = {
      id: faker.string.uuid(),
      name: faker.lorem.word(),
      type: faker.helpers.arrayElement(Object.values(QUEUE_TYPES)),
      tracks: faker.helpers.multiple(() => new TrackBuilder().build()),
    }
  }

  withTracks(tracks: Track[]) {
    this.queue.tracks = tracks
    return this
  }

  build() {
    return this.queue
  }
}
