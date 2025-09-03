import { ChangeDetectionStrategy, Component } from '@angular/core'

import { GenreTable } from '../../components'

@Component({
  selector: 'n-genres-management-page',
  imports: [GenreTable],
  template: ` <n-genre-table /> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenresManagementPage {}
