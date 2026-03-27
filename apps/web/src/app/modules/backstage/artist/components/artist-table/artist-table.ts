import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { AgGridModule } from 'ag-grid-angular'
import { ColDef, AllCommunityModule, GridOptions } from 'ag-grid-community'
import { Router } from '@angular/router'

import { ArtistApi } from '../../artist-api'
import { ArtistNameCellRenderer } from './artist-name-cell-renderer'

import { StatusIndicatorCellRenderer } from '@/modules/backstage/shared/components'
import { GRID_OPTIONS, provideGridOptions } from '@/modules/backstage/shared/providers'
import { Graphql } from '@/core/services/graphql'
import {
  GetBackstageArtistDocument,
  GetBackstageArtistQuery,
  GetBackstageArtistQueryVariables,
} from '@/shared/graphql/graphql'

@Component({
  selector: 'n-artist-table',
  imports: [AgGridModule],
  templateUrl: './artist-table.html',
  styleUrl: './artist-table.scss',
  providers: [ArtistApi, provideGridOptions()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistTable {
  private readonly router = inject(Router)
  private readonly graphql = inject(Graphql)
  private readonly defaultGridOptions = inject(GRID_OPTIONS)

  protected readonly artistsResource = this.graphql.graphqlResource<
    GetBackstageArtistQuery,
    GetBackstageArtistQueryVariables
  >(GetBackstageArtistDocument, {})

  protected readonly gridOptions: GridOptions = {
    ...this.defaultGridOptions,
    onRowClicked: (event) => {
      this.router.navigate([`/backstage/artists/${event.data.id}`])
    },
  }
  protected readonly modules = [AllCommunityModule]
  protected readonly columnDefs: ColDef<GetBackstageArtistQuery['backstageArtists'][number]>[] = [
    { field: 'name', headerName: 'Name', flex: 1, cellRenderer: ArtistNameCellRenderer },
    { field: 'status', headerName: 'Status', width: 160, cellRenderer: StatusIndicatorCellRenderer },
    { field: 'mediaStatus', headerName: 'Media Status', width: 160 },
  ]
}
