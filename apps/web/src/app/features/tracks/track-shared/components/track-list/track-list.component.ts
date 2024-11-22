import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'
import { trackListSelectors } from '@selectors'

import { LinkedTrack } from '../../models'

@Component({
  selector: 'neko-track-list',
  templateUrl: './track-list.component.html',
  styleUrl: './track-list.component.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackListComponent {
  @Input({ required: true }) label: string
  @Input({ required: true }) tracks: LinkedTrack[]

  @Output() togglePlay = new EventEmitter<string>()

  readonly selectors = trackListSelectors
}
