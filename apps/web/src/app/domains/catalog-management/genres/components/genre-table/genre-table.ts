import { ChangeDetectionStrategy, Component, inject, resource } from '@angular/core'
import { AgGridModule } from 'ag-grid-angular'
import { ColDef } from 'ag-grid-community'
import { HttpClient } from '@angular/common/http'
import { firstValueFrom } from 'rxjs'
import { Contracts } from '@neko/contracts'

import { GRID_OPTIONS } from '@/core/injectors'
import { RecordStatusCellRenderer } from '@/domains/catalog-management/shared/components'
import { ENVIRONMENT } from '@/core/providers'

@Component({
  selector: 'n-genre-table',
  imports: [AgGridModule],
  templateUrl: './genre-table.html',
  styleUrl: './genre-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenreTable {
  private readonly http = inject(HttpClient)
  private readonly environment = inject(ENVIRONMENT)

  protected readonly gridOptions = inject(GRID_OPTIONS)
  protected readonly columnDefs: ColDef[] = [
    { field: 'status', headerName: 'Status', width: 160, cellRenderer: RecordStatusCellRenderer },
    { field: 'name', headerName: 'Name', flex: 1 },
  ]
  protected readonly rowData: unknown[] = []

  protected readonly genresResource = resource({
    loader: () =>
      firstValueFrom(
        this.http.get<Contracts.CatalogManagement.GenreResponse[]>(
          `${this.environment.apiUrl}/catalog-management/genres`,
        ),
      ),
  })
}
