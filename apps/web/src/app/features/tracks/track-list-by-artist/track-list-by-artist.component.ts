import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core'
import { artistDetailsSelectors } from '@selectors'

import { TrackSharedModule } from '../track-shared'
import { TrackListByArtistState } from './track-list-by-artist.state'

import { PlaybackState } from '@core/state'
import { SharedModule } from '@shared/shared.module'
import { SelectorDirective } from '@shared/directives'

@Component({
  standalone: true,
  selector: 'neko-track-list-by-artist',
  templateUrl: './track-list-by-artist.component.html',
  imports: [SharedModule, TrackSharedModule],
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
