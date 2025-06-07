export const QUEUE_TYPES = {
  Playlist: 'playlist',
  Album: 'album',
  Recommendations: 'recommendations',
  UserQueue: 'user_queue',
} as const

export type QueueType = (typeof QUEUE_TYPES)[keyof typeof QUEUE_TYPES]
