import { ChangeDetectionStrategy, Component } from '@angular/core'

import { ArtistTable } from '../../components'

@Component({
  selector: 'n-artists-management-page',
  imports: [ArtistTable],
  template: ` <n-artist-table /> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistsManagementPage {}
