import { Selectors } from './types'

export const playbackQueueSelectors = {
  queueContainer: 'playback-queue-container',
  queueNextTabButton: 'playback-queue-next-tab-button',
  queueHistoryTabButton: 'playback-queue-history-tab-button',
  emptyQueueMessage: 'playback-queue-empty-message',
  queueNextContainer: 'playback-queue-next-container',
  queueNextTrackItem: 'playback-queue-next-track-item',
} satisfies Selectors
