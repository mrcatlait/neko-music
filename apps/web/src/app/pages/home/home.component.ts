import { ChangeDetectionStrategy, Component } from '@angular/core'

import { TrackNewReleasesModule } from '@features/tracks/track-new-releases'
import { SharedModule } from '@shared/shared.module'

@Component({
  standalone: true,
  selector: 'neko-home',
  imports: [SharedModule, TrackNewReleasesModule],
  templateUrl: 'home.component.html',
  styleUrl: 'home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {}
