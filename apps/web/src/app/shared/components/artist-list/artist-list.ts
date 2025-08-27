import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core'
import { RouterLink } from '@angular/router'

import { AlbumArtist, TrackArtist } from '@/shared/entities'
import { UiStore } from '@/core/stores'

@Component({
  selector: 'n-artist-list',
  imports: [RouterLink],
  templateUrl: './artist-list.html',
  styleUrl: './artist-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistList {
  private readonly uiStore = inject(UiStore)

  protected readonly touchDevice = computed(() => this.uiStore.touchDevice())

  artists = input.required<TrackArtist[] | AlbumArtist[]>()
}
