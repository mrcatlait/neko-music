import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'
import { trackListSelectors } from '@neko/ui-test/selectors'

import { LinkedTrack } from '../../models'
import { TrackListItemComponent } from '../track-list-item/track-list-item.component'

import { SelectorDirective } from '@shared/directives'

@Component({
  selector: 'neko-track-list',
  templateUrl: './track-list.component.html',
  styleUrl: './track-list.component.scss',
  imports: [TrackListItemComponent, SelectorDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackListComponent {
  @Input({ required: true }) label: string
  @Input({ required: true }) tracks: LinkedTrack[]

  @Output() togglePlay = new EventEmitter<string>()

  readonly selectors = trackListSelectors
}
