import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core'
import { AgGridModule } from 'ag-grid-angular'
import { ColDef, AllCommunityModule, GridOptions } from 'ag-grid-community'
import { HttpErrorResponse } from '@angular/common/http'
import { Contracts } from '@neko/contracts'
import { Router } from '@angular/router'

import { GenreApi } from '@/modules/backstage/shared/services'
import { GRID_OPTIONS, provideGridOptions } from '@/modules/backstage/shared/providers'

@Component({
  selector: 'n-genre-table',
  imports: [AgGridModule],
  templateUrl: './genre-table.html',
  styleUrl: './genre-table.scss',
  providers: [GenreApi, provideGridOptions()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenreTable implements OnInit {
  private readonly router = inject(Router)
  private readonly genreApi = inject(GenreApi)
  private readonly defaultGridOptions = inject(GRID_OPTIONS)

  protected readonly gridOptions: GridOptions = {
    ...this.defaultGridOptions,
    onRowClicked: (event) => {
      this.router.navigate([`/backstage/genres/${event.data.id}`])
    },
  }
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

  protected readonly rowData = signal<Contracts.Backstage.GenreStatistics[]>([])
  protected readonly error = signal<string | null>(null)

  ngOnInit(): void {
    this.genreApi.getStatistics().subscribe({
      next: (response) => {
        this.rowData.set(response.data)
      },
      error: (error) => {
        if (error instanceof HttpErrorResponse) {
          this.error.set(error.error.message)
        } else {
          this.error.set('An error occurred while fetching genres. Please try again later.')
        }
      },
    })
  }
}
