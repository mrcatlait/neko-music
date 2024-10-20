import { ChangeDetectionStrategy, Component } from '@angular/core'

import { TrackListNewReleasesComponent } from '@features/tracks/track-list-new-releases'
import { SharedModule } from '@shared/shared.module'

@Component({
  standalone: true,
  selector: 'neko-home-page',
  imports: [SharedModule, TrackListNewReleasesComponent],
  templateUrl: 'home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {}
