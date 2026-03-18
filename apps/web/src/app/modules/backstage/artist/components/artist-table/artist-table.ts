import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core'
import { AgGridModule } from 'ag-grid-angular'
import { ColDef, AllCommunityModule, GridOptions } from 'ag-grid-community'
import { HttpErrorResponse } from '@angular/common/http'
import { Contracts } from '@neko/contracts'
import { Router } from '@angular/router'

import { ArtistApi } from '../../artist-api'

import { RecordStatusCellRenderer } from '@/modules/backstage/shared/components'
import { GRID_OPTIONS, provideGridOptions } from '@/modules/backstage/shared/providers'

@Component({
  selector: 'n-artist-table',
  imports: [AgGridModule],
  templateUrl: './artist-table.html',
  styleUrl: './artist-table.scss',
  providers: [ArtistApi, provideGridOptions()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistTable implements OnInit {
  private readonly router = inject(Router)
  private readonly artistApi = inject(ArtistApi)
  private readonly defaultGridOptions = inject(GRID_OPTIONS)

  protected readonly gridOptions: GridOptions = {
    ...this.defaultGridOptions,
    onRowClicked: (event) => {
      this.router.navigate([`/backstage/artists/${event.data.id}`])
    },
  }
  protected readonly modules = [AllCommunityModule]
  protected readonly columnDefs: ColDef<Contracts.Backstage.Artists.Statistics>[] = [
    { field: 'status', headerName: 'Status', width: 160, cellRenderer: RecordStatusCellRenderer },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'totalAlbums', headerName: 'Total Albums', width: 160 },
    { field: 'totalTracks', headerName: 'Total Tracks', width: 160 },
  ]

  protected readonly rowData = signal<Contracts.Backstage.Artists.Statistics[]>([])
  protected readonly error = signal<string | null>(null)

  ngOnInit(): void {
    this.artistApi.getStatistics().subscribe({
      next: (response) => {
        this.rowData.set(response.data)
      },
      error: (err) => {
        if (err instanceof HttpErrorResponse) {
          this.error.set(err.error.message)
        } else {
          this.error.set('An error occurred while fetching artists. Please try again later.')
        }
      },
    })
  }
}
