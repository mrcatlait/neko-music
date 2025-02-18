import { ChangeDetectionStrategy, Component } from '@angular/core'
import { AgGridAngular } from 'ag-grid-angular'
import { ClientSideRowModelModule, GridOptions, Module, themeMaterial } from 'ag-grid-community'

@Component({
  selector: 'n-artist-list',
  imports: [AgGridAngular],
  templateUrl: './artist-list.component.html',
  styleUrl: './artist-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistListComponent {
  readonly gridOptions: GridOptions = {
    columnDefs: [
      { headerName: 'Name', field: 'name' },
      { headerName: 'Bio', field: 'bio' },
      { headerName: 'Tracks', field: 'tracks' },
    ],
    theme: themeMaterial.withParams({
      primaryColor: 'var(--color-primary)',
      backgroundColor: 'transparent',
      borderColor: 'var(--color-outline)',
      textColor: 'var(--color-text-high-emphasis)',
      headerTextColor: 'var(--color-text-high-emphasis)',
      fontFamily: 'var(--font-family)',
      fontSize: 'var(--typography-body-medium-size)',
      headerFontSize: 'var(--typography-body-large-size)',
      headerFontWeight: 'var(--typography-body-large-weight)',
      rowHoverColor: 'var(--color-surface-container)',
      headerCellHoverBackgroundColor: 'var(--color-surface-container)',
    }),
  }

  readonly modules: Module[] = [ClientSideRowModelModule]

  readonly rowData = [
    {
      name: 'John Doe',
      bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      tracks: 10,
    },
    {
      name: 'Jane Smith',
      bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      tracks: 20,
    },
    {
      name: 'Michael Johnson',
      bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      tracks: 30,
    },
    {
      name: 'Emily White',
      bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      tracks: 40,
    },
  ]
}
