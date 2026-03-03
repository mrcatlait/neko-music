import { Component, ChangeDetectionStrategy } from '@angular/core'
import { RouterLink } from '@angular/router'

import { GenreForm } from '../../components'

import { IconButton } from '@/shared/components'

@Component({
  selector: 'n-genre-creation-page',
  templateUrl: './genre-creation-page.html',
  styleUrl: './genre-creation-page.scss',
  imports: [GenreForm, IconButton, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenreCreationPage {}
