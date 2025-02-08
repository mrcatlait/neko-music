import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core'
import { artistDetailsSelectors } from '@neko/ui-selectors'
import { SelectorDirective } from '@neko/ui-shared/directives'

import { TrackListByArtistState } from './track-list-by-artist.state'
import { TrackListComponent } from '../track-shared/components'

import { PlaybackState } from '@core/states'

@Component({
  standalone: true,
  selector: 'neko-track-list-by-artist',
  templateUrl: './track-list-by-artist.component.html',
  imports: [TrackListComponent],
  providers: [TrackListByArtistState],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackListByArtistComponent extends SelectorDirective implements OnInit {
  @Input({ required: true }) artistId: string

  private readonly state = inject(TrackListByArtistState)
  private readonly playbackState = inject(PlaybackState)

  readonly tracks = this.state.tracks
  readonly loading = this.state.loading

  readonly currentTrackId = this.playbackState.currentTrackId

  readonly queue = this.state.queue

  readonly selectors = artistDetailsSelectors

  override selector = this.selectors.trackListContainer

  ngOnInit() {
    this.state.fetch({ artistId: this.artistId })
  }

  handleTogglePlay(trackId: string) {
    this.playbackState.togglePlay({ queue: this.queue(), trackId })
  }
}
