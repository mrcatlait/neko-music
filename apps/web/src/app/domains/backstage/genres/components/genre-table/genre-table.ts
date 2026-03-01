import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { AgGridModule } from 'ag-grid-angular'
import { ColDef, AllCommunityModule } from 'ag-grid-community'
import { httpResource } from '@angular/common/http'
import { Contracts } from '@neko/contracts'

import { GRID_OPTIONS } from '@/core/injectors'
import { ENVIRONMENT } from '@/core/providers'

@Component({
  selector: 'n-genre-table',
  imports: [AgGridModule],
  templateUrl: './genre-table.html',
  styleUrl: './genre-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenreTable {
  private readonly environment = inject(ENVIRONMENT)

  protected readonly gridOptions = inject(GRID_OPTIONS)
  protected readonly modules = [AllCommunityModule]
  protected readonly columnDefs: ColDef<Contracts.Backstage.GenreStatistics>[] = [
    { field: 'name', headerName: 'Name', flex: 1 },
    {
      field: 'totalArtists',
      headerName: 'Total Artists',
      flex: 1,
    },
    {
      field: 'totalAlbums',
      headerName: 'Total Albums',
      flex: 1,
    },
    {
      field: 'totalTracks',
      headerName: 'Total Tracks',
      flex: 1,
    },
  ]
  protected readonly rowData: unknown[] = []

  protected readonly genreStatisticsResource = httpResource<Contracts.Backstage.GenreStatisticsResponse>(
    () => `${this.environment.apiUrl}/backstage/genres/statistics`,
  )
}
