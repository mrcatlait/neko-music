// Example of how the separated architecture would work

import { QueueState } from './queue.state.svelte';
import { PlaybackState } from './playback.state.svelte';

export function createPlayerSystem() {
  // Create separate states
  const queueState = new QueueState();
  const playbackState = new PlaybackState(queueState);

  return { queueState, playbackState };
}

// Usage example in a Svelte component context
export function playerUsageExample() {
  const { queueState, playbackState } = createPlayerSystem();

  // Queue management is handled by QueueState
  const albumQueue = queueState.createQueue('My Album', [], { type: 'album' });
  const radioQueue = queueState.createQueue('Chill Radio', [], { type: 'radio' });
  
  // Switch between queues
  queueState.setCurrentQueue(albumQueue.id);
  
  // Playback controls handled by PlaybackState
  const someQueueItem = albumQueue.items[0];
  if (someQueueItem) {
    playbackState.playQueueItem(someQueueItem);
  }
  
  // Check playback state for specific queue items
  const isPlaying = playbackState.isQueueItemPlaying(someQueueItem);
  
  return {
    // Queue state for UI
    queues: queueState.queues,
    currentQueue: queueState.currentQueue,
    canGoBack: queueState.canGoBack,
    
    // Playback state for controls
    isPlaying: playbackState.status === 'playing',
    currentTrack: playbackState.currentTrack,
    volume: playbackState.volume,
    
    // Actions
    play: () => playbackState.play(),
    pause: () => playbackState.pause(),
    next: () => playbackState.next(),
    previous: () => playbackState.previous(),
    switchQueue: (queueId: string) => queueState.setCurrentQueue(queueId),
  };
} 