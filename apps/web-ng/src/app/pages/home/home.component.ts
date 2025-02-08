import { ChangeDetectionStrategy, Component } from '@angular/core'

import { TrackListNewReleasesComponent } from '@features/tracks/track-list-new-releases'
import { AppBarComponent } from '@shared/components'

@Component({
  standalone: true,
  selector: 'neko-home-page',
  imports: [AppBarComponent, TrackListNewReleasesComponent],
  templateUrl: 'home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {}
