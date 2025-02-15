import { ChangeDetectionStrategy, Component } from '@angular/core'

import { TrackListNewReleasesComponent } from '@features/tracks/track-list-new-releases'

@Component({
  standalone: true,
  selector: 'neko-home-page',
  imports: [TrackListNewReleasesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {}
