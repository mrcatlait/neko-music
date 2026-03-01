import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core'
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router'

import { Player } from '@/domains/playback/player'
import { PlaybackStore } from '@/core/stores'
import { PLAYBACK_STATUS } from '@/shared/enums'

@Component({
  selector: 'n-main-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, Player],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayout {
  private readonly playbackStore = inject(PlaybackStore)

  protected readonly showPlayer = computed(() => this.playbackStore.status() !== PLAYBACK_STATUS.None)
}
