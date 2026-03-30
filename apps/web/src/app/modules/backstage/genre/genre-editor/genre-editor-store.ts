import { inject, Injectable, Provider, signal } from '@angular/core'
import { disabled, form, required, TreeValidationResult } from '@angular/forms/signals'
import { Router } from '@angular/router'

import { Genre } from './models'

import { CreateGenreGql, GetBackstageGenreGql, UpdateGenreGql } from '@/shared/generated-types'
import { Snackbar } from '@/shared/snackbar'

export const provideGenreEditorStore = (): Provider[] => {
  return [GenreEditorStore, GetBackstageGenreGql, UpdateGenreGql, CreateGenreGql]
}

/**
 * @todo add handling of server validation for duplicate name and slug similar to registration page
 */
@Injectable()
export class GenreEditorStore {
  private readonly getBackstageGenreGql = inject(GetBackstageGenreGql)
  private readonly updateGenreGql = inject(UpdateGenreGql)
  private readonly createGenreGql = inject(CreateGenreGql)
  private readonly snackbar = inject(Snackbar)
  private readonly router = inject(Router)

  readonly loading = signal(false)
  readonly genreId = signal<string | null>(null)

  private readonly genreModel = signal<Genre>({
    name: '',
    slug: '',
  })

  readonly genreForm = form(
    this.genreModel,
    (schemaPath) => {
      required(schemaPath.name, { message: 'Name is required' })
      required(schemaPath.slug, { message: 'Slug is required' })
      disabled(schemaPath, () => this.loading())
    },
    {
      submission: {
        action: async (genreForm) => {
          const genre = genreForm().value()
          return this.save(genre)
        },
        onInvalid: (genreForm) => {
          genreForm.name().markAsTouched()
          genreForm.slug().markAsTouched()
          // Focus the first error in the form
          genreForm().errorSummary()[0]?.fieldTree().focusBoundControl()
        },
      },
    },
  )

  fetchGenre(genreId: string): void {
    this.genreId.set(genreId)
    this.loading.set(true)

    this.getBackstageGenreGql.fetch({ id: genreId }).then((result) => {
      if (result.error) {
        this.snackbar.info(result.error.message)
      }

      if (result.data) {
        this.genreModel.set({
          name: result.data.backstageGenre.name,
          slug: result.data.backstageGenre.slug,
        })
      }

      this.loading.set(false)
    })
  }

  navigateToGenreList(): void {
    this.router.navigate(['/backstage/genres'])
  }

  private save(genre: Genre): Promise<TreeValidationResult> {
    this.loading.set(true)

    const genreId = this.genreId()

    if (genreId) {
      return this.updateGenreGql
        .mutate({ id: genreId, genre: { name: genre.name, slug: genre.slug } })
        .then((result) => {
          this.loading.set(false)

          if (result.error) {
            return this.handleMutationError(result.error)
          }

          this.navigateToGenreList()

          return null
        })
    } else {
      return this.createGenreGql.mutate({ genre: { name: genre.name, slug: genre.slug } }).then((result) => {
        this.loading.set(false)

        if (result.error) {
          return this.handleMutationError(result.error)
        }

        this.navigateToGenreList()

        return null
      })
    }
  }

  private handleMutationError(error: Error): TreeValidationResult {
    return {
      kind: 'server',
      message: error.message,
    }
  }
}
