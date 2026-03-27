import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { AgGridModule } from 'ag-grid-angular'
import { ColDef, AllCommunityModule, GridOptions } from 'ag-grid-community'
import { Router } from '@angular/router'

import { GenreApi } from '@/modules/backstage/shared/services'
import { GRID_OPTIONS, provideGridOptions } from '@/modules/backstage/shared/providers'
import { Graphql } from '@/core/services/graphql'
import {
  GetBackstageGenresDocument,
  GetBackstageGenresQuery,
  GetBackstageGenresQueryVariables,
} from '@/shared/graphql/graphql'
import { StatusIndicatorCellRenderer } from '@/modules/backstage/shared/components'

@Component({
  selector: 'n-genre-table',
  imports: [AgGridModule],
  templateUrl: './genre-table.html',
  styleUrl: './genre-table.scss',
  providers: [GenreApi, provideGridOptions()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenreTable {
  private readonly router = inject(Router)
  private readonly graphql = inject(Graphql)
  private readonly defaultGridOptions = inject(GRID_OPTIONS)

  protected readonly genresResource = this.graphql.graphqlResource<
    GetBackstageGenresQuery,
    GetBackstageGenresQueryVariables
  >(GetBackstageGenresDocument, {})

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
