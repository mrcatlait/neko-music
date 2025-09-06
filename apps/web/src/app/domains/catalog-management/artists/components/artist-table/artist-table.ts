import { ChangeDetectionStrategy, Component, inject, resource } from '@angular/core'
import { AgGridModule } from 'ag-grid-angular'
import { ColDef, ModuleRegistry, AllCommunityModule } from 'ag-grid-community'
import { HttpClient } from '@angular/common/http'
import { firstValueFrom } from 'rxjs'
import { Contracts } from '@neko/contracts'

import { GRID_OPTIONS } from '@/core/injectors'
import { ENVIRONMENT } from '@/core/providers'
import { RecordStatusCellRenderer } from '@/domains/catalog-management/shared/components'

ModuleRegistry.registerModules([AllCommunityModule])

@Component({
  selector: 'n-artist-table',
  imports: [AgGridModule],
  templateUrl: './artist-table.html',
  styleUrl: './artist-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistTable {
  private readonly http = inject(HttpClient)
  private readonly environment = inject(ENVIRONMENT)

  protected readonly gridOptions = inject(GRID_OPTIONS)
  protected readonly columnDefs: ColDef[] = [
    { field: 'status', headerName: 'Status', width: 160, cellRenderer: RecordStatusCellRenderer },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'verified', headerName: 'Verified', width: 160, cellRenderer: 'agCheckboxCellRenderer' },
  ]
  protected readonly rowData: unknown[] = []

  protected readonly artistsResource = resource({
    loader: () =>
      firstValueFrom(
        this.http.get<Contracts.CatalogManagement.ArtistResponse[]>(
          `${this.environment.apiUrl}/catalog-management/artists`,
        ),
      ),
  })
}
