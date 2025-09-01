import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core'
import { AgGridAngular } from 'ag-grid-angular'
import { ColDef } from 'ag-grid-community'
import { HttpClient } from '@angular/common/http'

import { ArtistTable } from './artist-table'

import { ENVIRONMENT, injectAgGridService, provideAgGridService } from '@/core/providers'
import { Artist } from '@/shared/entities'

@Component({
  selector: 'n-artist-management',
  imports: [AgGridAngular],
  templateUrl: './artist-management.html',
  styleUrl: './artist-management.scss',
  providers: [provideAgGridService(ArtistTable)],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistManagement implements OnInit {
  private readonly apiUrl = inject(ENVIRONMENT).apiUrl
  private readonly http = inject(HttpClient)

  private readonly artistTable = injectAgGridService<ArtistTable>()

  protected readonly gridOptions = this.artistTable.gridOptions

  readonly columnDefs: ColDef<Artist>[] = [{ field: 'name' }, { field: 'verified' }, { field: 'artwork' }]

  ngOnInit(): void {
    this.fetch()
  }

  fetch(): void {
    this.http.get<Artist[]>(`${this.apiUrl}/artists`).subscribe({
      next: (artists) => this.artistTable.setRowData(artists),
      error: (error) => console.error(error),
    })
  }
}
