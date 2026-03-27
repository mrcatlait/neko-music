import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { AgGridModule } from 'ag-grid-angular'
import { ColDef, AllCommunityModule, GridOptions } from 'ag-grid-community'
import { Router } from '@angular/router'

import { GRID_OPTIONS, provideGridOptions } from '@/modules/backstage/shared/providers'
import { StatusIndicatorCellRenderer } from '@/modules/backstage/shared/components'
import { GetBackstageGenresGql, GetBackstageGenresQuery } from '@/shared/generated-types'

@Component({
  selector: 'n-genre-table',
  imports: [AgGridModule],
  templateUrl: './genre-table.html',
  styleUrl: './genre-table.scss',
  providers: [provideGridOptions(), GetBackstageGenresGql],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenreTable {
  private readonly router = inject(Router)
  private readonly getBackstageGenresGql = inject(GetBackstageGenresGql)
  private readonly defaultGridOptions = inject(GRID_OPTIONS)

  protected readonly genresResource = this.getBackstageGenresGql.graphqlResource({})

  protected readonly gridOptions: GridOptions = {
    ...this.defaultGridOptions,
    onRowClicked: (event) => {
      this.router.navigate([`/backstage/genres/${event.data.id}`])
    },
  }
  protected readonly modules = [AllCommunityModule]
  protected readonly columnDefs: ColDef<GetBackstageGenresQuery['backstageGenres'][number]>[] = [
    { field: 'name', headerName: 'Name', flex: 1 },
    {
      field: 'slug',
      headerName: 'Slug',
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 160,
      cellRenderer: StatusIndicatorCellRenderer,
    },
  ]
}
