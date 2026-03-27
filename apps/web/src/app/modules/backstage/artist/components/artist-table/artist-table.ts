import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { AgGridModule } from 'ag-grid-angular'
import { ColDef, AllCommunityModule, GridOptions } from 'ag-grid-community'
import { Router } from '@angular/router'

import { ArtistNameCellRenderer } from './artist-name-cell-renderer'

import { StatusIndicatorCellRenderer } from '@/modules/backstage/shared/components'
import { GRID_OPTIONS, provideGridOptions } from '@/modules/backstage/shared/providers'
import { GetBackstageArtistsGql, GetBackstageArtistsQuery } from '@/shared/generated-types'

@Component({
  selector: 'n-artist-table',
  imports: [AgGridModule],
  templateUrl: './artist-table.html',
  styleUrl: './artist-table.scss',
  providers: [provideGridOptions(), GetBackstageArtistsGql],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistTable {
  private readonly router = inject(Router)
  private readonly getBackstageArtistsGql = inject(GetBackstageArtistsGql)
  private readonly defaultGridOptions = inject(GRID_OPTIONS)

  protected readonly artistsResource = this.getBackstageArtistsGql.graphqlResource({})

  protected readonly gridOptions: GridOptions = {
    ...this.defaultGridOptions,
    onRowClicked: (event) => {
      this.router.navigate([`/backstage/artists/${event.data.id}`])
    },
  }
  protected readonly modules = [AllCommunityModule]
  protected readonly columnDefs: ColDef<GetBackstageArtistsQuery['backstageArtists'][number]>[] = [
    { field: 'name', headerName: 'Name', flex: 1, cellRenderer: ArtistNameCellRenderer },
    { field: 'status', headerName: 'Status', width: 160, cellRenderer: StatusIndicatorCellRenderer },
    { field: 'mediaStatus', headerName: 'Media Status', width: 160 },
  ]
}
