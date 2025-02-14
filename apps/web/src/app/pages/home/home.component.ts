import { ChangeDetectionStrategy, Component } from '@angular/core'
import { AppBarComponent, LogoComponent } from '@neko/ui-shared/components'

import { TrackListNewReleasesComponent } from '@features/tracks/track-list-new-releases'

@Component({
  standalone: true,
  selector: 'neko-home-page',
  imports: [TrackListNewReleasesComponent, LogoComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {}
