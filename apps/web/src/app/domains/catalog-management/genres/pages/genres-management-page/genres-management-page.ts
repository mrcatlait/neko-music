import { ChangeDetectionStrategy, Component } from '@angular/core'

import { GenreTable } from '../../components'

import { Button } from '@/shared/components'

@Component({
  selector: 'n-genres-management-page',
  imports: [Button, GenreTable],
  templateUrl: './genres-management-page.html',
  styleUrl: './genres-management-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenresManagementPage {}
