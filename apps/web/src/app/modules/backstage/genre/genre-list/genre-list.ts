import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { Router, RouterLink } from '@angular/router'
import { AgGridAngular } from 'ag-grid-angular'
import { ColDef, AllCommunityModule, GridOptions } from 'ag-grid-community'

import { StatusIndicatorCellRenderer } from '../../shared/components'
import { GRID_OPTIONS, provideGridOptions } from '../../shared/providers'

import { GetBackstageGenresGql, GetBackstageGenresQuery } from '@/shared/generated-types'
import { Button } from '@/shared/components'

@Component({
  selector: 'n-genre-list',
  imports: [AgGridAngular, Button, RouterLink],
  templateUrl: './genre-list.html',
  styleUrl: './genre-list.scss',
  providers: [provideGridOptions(), GetBackstageGenresGql],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenreList {
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
