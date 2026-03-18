import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core'
import { Router } from '@angular/router'
import { HttpErrorResponse } from '@angular/common/http'
import { Contracts } from '@neko/contracts'

import { GenreForm } from '../../components'

import { GenreApi } from '@/modules/backstage/shared/services'
import { IconButton } from '@/shared/components'
import { Snackbar } from '@/shared/snackbar'

@Component({
  selector: 'n-genre-edit-page',
  templateUrl: './genre-edit-page.html',
  styleUrl: './genre-edit-page.scss',
  imports: [GenreForm, IconButton],
  providers: [GenreApi],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenreEditPage implements OnInit {
  private readonly router = inject(Router)
  private readonly genreApi = inject(GenreApi)
  private readonly snackbar = inject(Snackbar)

  readonly genreId = input.required<string>()

  protected readonly genre = signal<Contracts.Backstage.Genres.Genre | null>(null)
  protected readonly saving = signal(false)

  ngOnInit(): void {
    this.genreApi.getGenre(this.genreId()).subscribe({
      next: (response) => {
        this.genre.set(response)
      },
    })
  }

  protected editGenre(data: { name: string }): void {
    this.saving.set(true)

    this.genreApi.updateGenre(this.genreId(), { name: data.name }).subscribe({
      next: () => {
        this.saving.set(false)
        this.snackbar.info('Genre updated successfully')
        this.router.navigate(['/backstage/genres'])
      },
      error: (error) => {
        this.saving.set(false)

        if (error instanceof HttpErrorResponse) {
          this.snackbar.info(error.error.message ?? 'Failed to update genre')
        } else {
          this.snackbar.info('Failed to update genre')
        }
      },
    })
  }

  protected cancel(): void {
    this.router.navigate(['/backstage/genres'])
  }
}
