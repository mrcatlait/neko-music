import { ChangeDetectionStrategy, Component, inject, resource } from '@angular/core'
import { AgGridModule } from 'ag-grid-angular'
import { ColDef, AllCommunityModule } from 'ag-grid-community'
import { HttpClient } from '@angular/common/http'
import { firstValueFrom } from 'rxjs'
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
  private readonly http = inject(HttpClient)
  private readonly environment = inject(ENVIRONMENT)

  protected readonly gridOptions = inject(GRID_OPTIONS)
  protected readonly modules = [AllCommunityModule]
  protected readonly columnDefs: ColDef[] = [{ field: 'name', headerName: 'Name', flex: 1 }]
  protected readonly rowData: unknown[] = []

  protected readonly genresResource = resource({
    loader: () =>
      firstValueFrom(
        this.http.get<Contracts.Backstage.GenresResponse[]>(`${this.environment.apiUrl}/catalog-management/genres`),
      ),
  })
}
