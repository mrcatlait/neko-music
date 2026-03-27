import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core'
import { Router } from '@angular/router'

import { GenreForm } from '../../components'

import { IconButton } from '@/shared/components'
import { Snackbar } from '@/shared/snackbar'
import { GetBackstageGenreGql, GetBackstageGenreQuery, UpdateGenreGql } from '@/shared/generated-types'

@Component({
  selector: 'n-genre-edit-page',
  templateUrl: './genre-edit-page.html',
  styleUrl: './genre-edit-page.scss',
  imports: [GenreForm, IconButton],
  providers: [GetBackstageGenreGql, UpdateGenreGql],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenreEditPage implements OnInit {
  private readonly router = inject(Router)
  private readonly getBackstageGenreGql = inject(GetBackstageGenreGql)
  private readonly updateGenreGql = inject(UpdateGenreGql)
  private readonly snackbar = inject(Snackbar)

  protected readonly genre = signal<GetBackstageGenreQuery['backstageGenre'] | null>(null)

  readonly genreId = input.required<string>()

  protected readonly saving = signal(false)

  ngOnInit(): void {
    this.getBackstageGenreGql.fetch({ id: this.genreId() }).then((result) => {
      if (result.error) {
        this.snackbar.info(result.error.message)
      }

      if (result.data) {
        this.genre.set(result.data.backstageGenre)
      }
    })
  }

  protected editGenre(data: { name: string; slug: string }): void {
    this.saving.set(true)

    this.updateGenreGql.mutate({ id: this.genreId(), genre: { name: data.name, slug: data.slug } }).then((result) => {
      if (result.error) {
        this.saving.set(false)

        this.snackbar.info('Failed to update genre')
      }

      if (result.data) {
        this.saving.set(false)
        this.snackbar.info('Genre updated successfully')
        this.router.navigate(['/backstage/genres'])
      }
    })
  }

  protected navigateToGenreList(): void {
    this.router.navigate(['/backstage/genres'])
  }
}
