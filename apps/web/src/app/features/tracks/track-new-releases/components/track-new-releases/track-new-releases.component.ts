import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core'

import { TrackNewReleaseState } from '../../state'

import { trackNewReleasesSelectors } from 'selectors'

@Component({
  selector: 'neko-track-new-releases',
  templateUrl: './track-new-releases.component.html',
  styleUrl: './track-new-releases.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackNewReleasesComponent implements OnInit {
  private readonly trackNewReleasesState = inject(TrackNewReleaseState)

  readonly tracks = this.trackNewReleasesState.data
  readonly loading = this.trackNewReleasesState.loading
  readonly queue = this.trackNewReleasesState.queue

  readonly selectors = trackNewReleasesSelectors

  ngOnInit(): void {
    this.trackNewReleasesState.fetch()
  }
}
