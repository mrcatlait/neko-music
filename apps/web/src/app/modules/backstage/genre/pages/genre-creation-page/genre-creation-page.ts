import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { Router } from '@angular/router'

import { GenreForm } from '../../components'
import { GenreApi } from '@/modules/backstage/shared/services'
import { IconButton } from '@/shared/components'
import { Snackbar } from '@/shared/snackbar'

@Component({
  selector: 'n-genre-creation-page',
  templateUrl: './genre-creation-page.html',
  styleUrl: './genre-creation-page.scss',
  imports: [GenreForm, IconButton],
  providers: [GenreApi],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenreCreationPage {
  private readonly router = inject(Router)
  private readonly snackbar = inject(Snackbar)
  private readonly genreApi = inject(GenreApi)

  protected readonly saving = signal(false)

  protected createGenre(data: { name: string }): void {
    this.saving.set(true)

    this.genreApi.create({ name: data.name }).subscribe({
      next: () => {
        this.saving.set(false)
        this.snackbar.info('Genre created successfully')
        this.router.navigate(['/backstage/genres'])
      },
      error: (error) => {
        this.saving.set(false)

        if (error instanceof HttpErrorResponse) {
          this.snackbar.info(error.error.message ?? 'Failed to create genre')
        } else {
          this.snackbar.info('Failed to create genre')
        }
      },
    })
  }

  protected cancel(): void {
    this.router.navigate(['/backstage/genres'])
  }
}
