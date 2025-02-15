import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'
import { SelectorDirective } from '@neko/ui-shared/directives'
import { trackListSelectors } from '@neko/ui-selectors'

import { TrackListItemComponent } from '../track-list-item/track-list-item.component'

import { Track } from '@core/interfaces'

@Component({
  selector: 'neko-track-list',
  templateUrl: './track-list.component.html',
  styleUrl: './track-list.component.scss',
  imports: [TrackListItemComponent, SelectorDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackListComponent {
  @Input({ required: true }) label: string
  @Input({ required: true }) tracks: Track[]

  @Output() togglePlay = new EventEmitter<string>()

  readonly selectors = trackListSelectors
}
