import { REPEAT_OPTIONS, type RepeatOption } from "@/features/playback/enums";
import type { Track } from "@/shared/models";

type QueueType = 
  | 'playlist' 
  | 'album' 
  | 'recommendations' 
  | 'user_queue';

export interface Queue {
  id: string;
  name: string;
  type: QueueType;
  tracks: Track[];
}

export class QueueState {
  queue = $state<Queue | null>(null);

  tracks = $state<Track[]>([]);
  currentTrack = $state<Track | null>(null);

  repeat = $state<RepeatOption>(REPEAT_OPTIONS.None);
  shuffle = $state<boolean>(false);

  private readonly currentItemIndex = $derived(this.tracks.findIndex(track => track.id === this.currentTrack?.id));

  nextInQueue = $derived(
    this.tracks.filter((_, index) => index > this.currentItemIndex)
  );

  hasNext = $derived(this.currentItemIndex < this.tracks.length - 1 || this.repeat === REPEAT_OPTIONS.All);
  hasPrevious = $derived(this.currentItemIndex > 0 || this.repeat === REPEAT_OPTIONS.All);

  next(): void {
    if (!this.hasNext) {
      return;
    }

    if (this.currentItemIndex < this.tracks.length - 1) {
      this.currentTrack = this.tracks[this.currentItemIndex + 1];
    } else {
      this.currentTrack = this.tracks[0];
    }
  }

  previous(): void {
    if (!this.hasPrevious) {
      return;
    }

    if (this.currentItemIndex > 0) {
      this.currentTrack = this.tracks[this.currentItemIndex - 1];
    } else {
      this.currentTrack = this.tracks[this.tracks.length - 1];
    }
  }

  toggleRepeat(): void {
    switch (this.repeat) {
      case REPEAT_OPTIONS.None:
        this.repeat = REPEAT_OPTIONS.All;
        break;
      case REPEAT_OPTIONS.All:
        this.repeat = REPEAT_OPTIONS.Single;
        break;
      case REPEAT_OPTIONS.Single:
      default:
        this.repeat = REPEAT_OPTIONS.None;
        break;
    }
  }

  toggleShuffle(): void {
    this.shuffle = !this.shuffle;

    if (!this.queue) {
      return;
    }

    if (this.shuffle) {
      const shuffled = [...this.tracks];
      // Fisher-Yates shuffle
      for (let index = shuffled.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
      }
      
      this.tracks = shuffled;
    } else {
      this.tracks = [...this.queue.tracks];
    }
  }

  addToPlayNext(tracks: Track[]): void {
    if (!this.queue) {
      return;
    }

    const targetPosition = this.currentItemIndex + 1;
    this.tracks.splice(targetPosition, 0, ...tracks);

    const originalTargetPosition = this.queue.tracks.findIndex(track => track.id === this.currentTrack?.id) + 1;
    this.queue.tracks.splice(originalTargetPosition, 0, ...tracks);
  }

  addToPlayLater(tracks: Track[]): void {
    if (!this.queue) {
      return;
    }

    this.tracks.push(...tracks);
    this.queue.tracks.push(...tracks);
  }

  removeFromQueue(trackId: string): void {
    if (!this.queue) {
      return;
    }

    const trackIndex = this.tracks.findIndex(track => track.id === trackId);
    this.tracks.splice(trackIndex, 1);

    const originalTrackIndex = this.queue.tracks.findIndex(track => track.id === trackId);
    this.queue.tracks.splice(originalTrackIndex, 1);
  }

  moveTrack(trackId: string, targetPosition: number): void {
    if (!this.queue) {
      return;
    }

    const trackIndex = this.tracks.findIndex(track => track.id === trackId);
    const [track] = this.tracks.splice(trackIndex, 1);

    this.tracks.splice(targetPosition, 0, track);

    const originalTrackIndex = this.queue.tracks.findIndex(track => track.id === trackId);
    this.queue.tracks.splice(originalTrackIndex, 1);
    this.queue.tracks.splice(targetPosition, 0, track);
  }
}
