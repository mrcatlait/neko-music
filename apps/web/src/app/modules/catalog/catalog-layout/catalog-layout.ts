import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core'
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router'

import { PlaybackStore } from '@/core/stores'
import { PLAYBACK_STATUS } from '@/shared/enums'
import { Player } from '@/modules/playback/player'

@Component({
  selector: 'n-catalog-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, Player],
  templateUrl: './catalog-layout.html',
  styleUrl: './catalog-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogLayout {
  private readonly playbackStore = inject(PlaybackStore)

  protected readonly showPlayer = computed(() => this.playbackStore.status() !== PLAYBACK_STATUS.None)
}
