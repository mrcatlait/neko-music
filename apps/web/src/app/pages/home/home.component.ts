import { ChangeDetectionStrategy, Component } from '@angular/core'

import { TrackListNewReleasesComponent } from '@features/tracks/track-list-new-releases'

@Component({
  standalone: true,
  selector: 'neko-home-page',
  imports: [TrackListNewReleasesComponent],
  templateUrl: 'home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {}
