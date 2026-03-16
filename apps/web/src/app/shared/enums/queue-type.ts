export const QueueType = {
  Playlist: 'playlist',
  Album: 'album',
  Recommendations: 'recommendations',
  UserQueue: 'user_queue',
} as const

export type QueueType = (typeof QueueType)[keyof typeof QueueType]
