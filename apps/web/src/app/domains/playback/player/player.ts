import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core'

import { PlayerControls, ProgressControl, TrackInfo, VolumeControl } from './components'
import { KeyboardShortcuts } from './services'

import { PlaybackStore } from '@/core/stores'
import { PLAYBACK_STATUS } from '@/shared/enums'

@Component({
  selector: 'n-player',
  imports: [PlayerControls, TrackInfo, ProgressControl, VolumeControl],
  providers: [KeyboardShortcuts],
  templateUrl: './player.html',
  styleUrl: './player.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Player {
  private readonly playbackStore = inject(PlaybackStore)

  protected readonly enabled = computed(() => this.playbackStore.status() !== PLAYBACK_STATUS.None)
  protected readonly track = computed(() => this.playbackStore.queueStore.currentTrack())
}
