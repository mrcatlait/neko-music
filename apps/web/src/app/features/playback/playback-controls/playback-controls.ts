import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core'

import { PlayerControls, TrackInfo } from './components'

import { PlaybackStore } from '@/core/stores'
import { PLAYBACK_STATUS } from '@/shared/enums'

@Component({
  selector: 'n-playback-controls',
  imports: [PlayerControls, TrackInfo],
  templateUrl: './playback-controls.html',
  styleUrl: './playback-controls.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaybackControls {
  private readonly playbackStore = inject(PlaybackStore)

  protected readonly enabled = computed(() => this.playbackStore.status() !== PLAYBACK_STATUS.None)
  protected readonly track = computed(() => this.playbackStore.queueStore.currentTrack())
}
