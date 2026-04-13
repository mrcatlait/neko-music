import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { Router } from '@angular/router'
import { AgGridAngular } from 'ag-grid-angular'
import { ColDef, AllCommunityModule, GridOptions } from 'ag-grid-community'

import { StatusIndicatorCellRenderer } from '../../shared/components'
import { provideGridOptions, GRID_OPTIONS } from '../../shared/providers'
import { ArtistNameCellRenderer } from './components'

import { GetBackstageArtistsGql, GetBackstageArtistsQuery } from '@/shared/generated-types'
import { Button } from '@/shared/components'

@Component({
  selector: 'n-artist-list',
  imports: [AgGridAngular, Button],
  templateUrl: './artist-list.html',
  styleUrl: './artist-list.scss',
  providers: [provideGridOptions(), GetBackstageArtistsGql],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistList {
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

  protected createNew(): void {
    this.router.navigate(['/backstage/artists/create'])
  }
}
