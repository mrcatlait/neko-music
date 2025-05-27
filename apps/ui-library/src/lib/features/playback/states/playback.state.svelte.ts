import { onDestroy } from 'svelte';
import { RepeatOption } from "../enums/repeat-option.enum";

export class PlaybackState {
  currentTrackId = $state<string | null>(null);

  repeat = $state<RepeatOption>(RepeatOption.None);
  shuffle = $state<boolean>(false);

  constructor() {
    onDestroy(() => {
      // Clear
    });
  }

  play(trackId: string) {
    this.currentTrackId = trackId;
  }
}
