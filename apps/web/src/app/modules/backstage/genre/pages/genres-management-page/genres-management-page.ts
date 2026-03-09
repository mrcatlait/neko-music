import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'

import { GenreTable } from '../../components'

import { Button } from '@/shared/components'

@Component({
  selector: 'n-genres-management-page',
  imports: [Button, GenreTable, RouterLink],
  templateUrl: './genres-management-page.html',
  styleUrl: './genres-management-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenresManagementPage {}
