import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core'
import { Router } from '@angular/router'

import { GenreForm } from '../../components'

import { IconButton } from '@/shared/components'
import { Snackbar } from '@/shared/snackbar'
import { CreateGenreGql } from '@/shared/generated-types'

@Component({
  selector: 'n-genre-creation-page',
  templateUrl: './genre-creation-page.html',
  styleUrl: './genre-creation-page.scss',
  imports: [GenreForm, IconButton],
  providers: [CreateGenreGql],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenreCreationPage {
  private readonly router = inject(Router)
  private readonly snackbar = inject(Snackbar)
  private readonly createGenreGql = inject(CreateGenreGql)

  protected readonly saving = signal(false)

  protected createGenre(data: { name: string; slug: string }): void {
    this.saving.set(true)

    this.createGenreGql.mutate({ genre: { name: data.name, slug: data.slug } }).then((result) => {
      if (result.error) {
        this.saving.set(false)
        this.snackbar.info(result.error.message)
      }

      if (result.data) {
        this.saving.set(false)
        this.snackbar.info('Genre created successfully')
        this.router.navigate(['/backstage/genres'])
      }
    })
  }

  protected navigateToGenreList(): void {
    this.router.navigate(['/backstage/genres'])
  }
}
