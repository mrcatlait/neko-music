import { AudioService } from '../services';
import type { QueueItem, QueueState } from './queue.state.svelte';
import { REPEAT_OPTIONS } from '@/features/playback/enums';

const PLAYBACK_STATUS = {
  Pending: 'pending',
  Playing: 'playing',
  Paused: 'paused',
  Ended: 'ended',
  Loading: 'loading',
} as const;

type PlaybackStatus = (typeof PLAYBACK_STATUS)[keyof typeof PLAYBACK_STATUS];

export class PlaybackState {
  // Current playback state
  currentQueueItem = $state<QueueItem | null>(null);
  
  // Playback status
  status = $state<PlaybackStatus>(PLAYBACK_STATUS.Pending);

  // Playback controls
  volume = $state<number>(50);
  muted = $state<boolean>(false);
  currentTime = $state<number>(0);

  private readonly audioService = new AudioService({
    onPlaybackTimeUpdate: (event) => {
      this.currentTime = event.time ?? 0
    },
    onCanPlay: () => {
      this.status = PLAYBACK_STATUS.Playing
    },
    onPlaybackEnded: () => {
      this.ended()
    }
  });

  // Inject queue state dependency
  constructor(private queueState: QueueState) {}

  // Derived values
  currentTrack = $derived(this.currentQueueItem?.track ?? null);
  
  private get currentItemIndex(): number {
    return this.queueState.activeQueueItems.findIndex(item => item.id === this.currentQueueItem?.id);
  }
  
  get hasPrevious(): boolean {
    return this.currentItemIndex > 0 || this.queueState.repeat === REPEAT_OPTIONS.All;
  }
  
  get hasNext(): boolean {
    return this.currentItemIndex < this.queueState.activeQueueItems.length - 1 || 
           this.queueState.repeat === REPEAT_OPTIONS.All;
  }

  // Playback controls
  play(): void {
    this.status = PLAYBACK_STATUS.Playing;
    this.audioService.play();
  }

  pause(): void {
    this.status = PLAYBACK_STATUS.Paused;
    this.audioService.pause()
  }

  togglePlay(): void {
    switch (this.status) {
      case PLAYBACK_STATUS.Playing:
        return this.pause()
      case PLAYBACK_STATUS.Paused:
        return this.play()
      default:
        return
    }
  }

  seek(time: number): void {
    this.currentTime = time;
    this.audioService.seek(time)
  }

  setVolume(volume: number): void {
    this.volume = volume;
    this.muted = volume === 0;
    this.audioService.setVolume(volume)
  }

  toggleMute(): void {
    this.muted = !this.muted || this.volume === 0;
    this.audioService.setMute(this.muted)
  }

  // Navigation methods that delegate to queue state
  next(): void {
    if (!this.hasNext) {
      return;
    }

    let nextItem: QueueItem | null = null;

    if (this.currentItemIndex < this.queueState.activeQueueItems.length - 1) {
      nextItem = this.queueState.activeQueueItems[this.currentItemIndex + 1]
    } else if (this.queueState.repeat === REPEAT_OPTIONS.All) {
      nextItem = this.queueState.activeQueueItems[0]
    }

    if (nextItem) {
      this.loadQueueItem(nextItem);
    }
  }

  previous(): void {
    if (!this.hasPrevious) {
      return;
    }

    let previousItem: QueueItem | null = null;

    if (this.currentItemIndex > 0) {
      previousItem = this.queueState.activeQueueItems[this.currentItemIndex - 1]
    } else if (this.queueState.repeat === 'All') {
      previousItem = this.queueState.activeQueueItems[this.queueState.activeQueueItems.length - 1]
    }

    if (previousItem) {
      this.loadQueueItem(previousItem);
    }
  }

  // Delegate queue behavior to QueueState
  toggleRepeat(): void {
    this.queueState.toggleRepeat();
  }

  toggleShuffle(): void {
    this.queueState.toggleShuffle();
  }

  // Playback specific methods
  playQueueItem(queueItem: QueueItem): void {
    // Switch to the queue containing this item if necessary
    if (this.queueState.currentQueueId !== queueItem.queueId) {
      this.queueState.setCurrentQueue(queueItem.queueId);
    }
    
    this.loadQueueItem(queueItem);
  }

  // Check if a specific queue item is currently playing
  isQueueItemPlaying(queueItem: QueueItem): boolean {
    return this.currentQueueItem?.id === queueItem.id && 
           this.status === PLAYBACK_STATUS.Playing;
  }

  // Check if a specific queue item is the current item (playing or paused)
  isCurrentQueueItem(queueItem: QueueItem): boolean {
    return this.currentQueueItem?.id === queueItem.id;
  }

  ended(): void {
    switch (this.queueState.repeat) {
      case 'Single':
        this.play()
        break
      case 'All':
        this.next()
        break
      case 'None':
      default:
        if (this.hasNext) {
          this.next()
        } else {
          this.pause()
        }
        break
    }
  }

  private loadQueueItem(queueItem: QueueItem): void {
    this.currentQueueItem = queueItem;
    this.status = PLAYBACK_STATUS.Loading;
    this.currentTime = 0;
    
    // You'll need to add a url property to Track or handle this differently
    // this.audioService.setSource(queueItem.track.url);
  }
}
