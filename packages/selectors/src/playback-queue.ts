import { Selectors } from './types'

export const playbackQueueSelectors = {
  queueContainer: 'playback-queue-container',
  queueNowPlayingTabButton: 'playback-queue-now-playing-tab-button',
  queueHistoryTabButton: 'playback-queue-history-tab-button',
  emptyQueueMessage: 'playback-queue-empty-message',
  queueNowPlayingContainer: 'playback-queue-now-playing-container',
  queueNowPlayingTrackItem: 'playback-queue-now-playing-track-item',
} satisfies Selectors
