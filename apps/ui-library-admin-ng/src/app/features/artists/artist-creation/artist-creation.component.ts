import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'n-artist-creation',
  templateUrl: './artist-creation.component.html',
  styleUrl: './artist-creation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistCreationComponent {}
