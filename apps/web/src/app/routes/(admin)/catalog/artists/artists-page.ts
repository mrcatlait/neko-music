import { ChangeDetectionStrategy, Component } from '@angular/core'

import { ArtistManagement } from '@/features/artist/artist-management'

@Component({
  selector: 'n-artists-page',
  imports: [ArtistManagement],
  template: ` <n-artist-management /> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistsPage {}
