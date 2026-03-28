import { ChangeDetectionStrategy, Component, computed, effect, inject, input, model, signal } from '@angular/core'
import { form, FormField, FormValueControl, ValidationError, WithOptionalFieldTree } from '@angular/forms/signals'

import { Autocomplete, AutocompleteOption, AutocompleteTrigger } from '@/shared/autocomplete'
import { Textfield, Chip, LoadingIndicator } from '@/shared/components'
import { GetBackstageGenresByFilterGql, type GetBackstageGenresByFilterQuery } from '@/shared/generated-types'

interface FilterModel {
  value: string
}

/**
 * Backstage multi-select for genre IDs: loads genres once, then filters by the search field locally
 * (same idea as {@link ArtistAutocomplete}).
 */
@Component({
  selector: 'n-genre-autocomplete',
  templateUrl: './genre-autocomplete.html',
  styleUrl: './genre-autocomplete.scss',
  imports: [Textfield, Autocomplete, AutocompleteOption, AutocompleteTrigger, Chip, LoadingIndicator, FormField],
  providers: [GetBackstageGenresByFilterGql],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenreAutocomplete implements FormValueControl<string[]> {
  private readonly getBackstageGenresByFilterGql = inject(GetBackstageGenresByFilterGql)

  readonly value = model<string[]>([])
  readonly errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([])
  readonly disabled = input(false)
  readonly invalid = input(false)
  readonly touched = model(false)

  protected readonly loading = signal(false)

  private readonly availableGenres = signal<GetBackstageGenresByFilterQuery['backstageGenres']>([])

  private readonly filterValue = signal<FilterModel>({ value: '' })
  protected readonly filterForm = form(this.filterValue)

  protected readonly filteredGenres = computed(() => {
    const query = this.filterValue()?.value?.trim().toLowerCase() ?? ''
    const selectedIds = new Set(this.value())

    return this.availableGenres()

    return this.availableGenres().filter((genre) => {
      if (selectedIds.has(genre.id)) {
        return false
      }
      if (query.length === 0) {
        return true
      }
      return genre.name.toLowerCase().includes(query)
    })
  })
  protected readonly selectedGenres = computed(() => this.availableGenres().filter((g) => this.value().includes(g.id)))

  constructor() {
    effect(() => {
      if (this.touched()) {
        this.filterForm.value().markAsTouched()
      }

      this.loadGenres()
    })
  }

  private loadGenres(): void {
    this.loading.set(true)

    this.getBackstageGenresByFilterGql
      .fetch({
        limit: 10,
        offset: 0,
        search: this.filterValue().value,
      })
      .then(({ error, data }) => {
        this.loading.set(false)

        if (error) {
          console.error(error)
        }

        if (data) {
          this.availableGenres.set(data.backstageGenres)
        }
      })
  }

  protected addGenre(genreId: unknown): void {
    this.touched.set(true)

    const newGenre = this.availableGenres().find((g) => g.id === genreId)

    if (newGenre) {
      this.value.update((genres) => [...genres, newGenre.id])
    }

    this.filterValue.set({ value: '' })
  }

  protected removeGenre(genreId: string): void {
    this.touched.set(true)
    this.value.update((genres) => genres.filter((g) => g !== genreId))
  }
}
