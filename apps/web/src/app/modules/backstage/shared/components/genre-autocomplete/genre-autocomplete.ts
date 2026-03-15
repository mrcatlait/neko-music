import { ChangeDetectionStrategy, Component, computed, inject, input, model, OnInit, signal } from '@angular/core'
import { form, FormField, FormValueControl, ValidationError, WithOptionalFieldTree } from '@angular/forms/signals'
import { Contracts } from '@neko/contracts'
import { HttpErrorResponse } from '@angular/common/http'

import { GenreApi } from '../../services/genre-api'

import { Autocomplete, AutocompleteOption, AutocompleteTrigger } from '@/shared/autocomplete'
import { Textfield, InputChip, LoadingIndicator } from '@/shared/components'

@Component({
  selector: 'n-genre-autocomplete',
  templateUrl: './genre-autocomplete.html',
  styleUrl: './genre-autocomplete.scss',
  imports: [Textfield, Autocomplete, AutocompleteOption, AutocompleteTrigger, InputChip, LoadingIndicator, FormField],
  providers: [GenreApi],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenreAutocomplete implements FormValueControl<string[]>, OnInit {
  private readonly genreApi = inject(GenreApi)

  readonly value = model<string[]>([])
  readonly errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([])
  readonly disabled = input(false)
  readonly invalid = input(false)
  readonly touched = model(false)

  protected readonly loading = signal(false)

  private readonly availableGenres = signal<Contracts.Backstage.Genre[]>([])

  private readonly filterValue = signal<string>('')
  protected readonly filterForm = form(this.filterValue)

  protected readonly filteredGenres = computed(() => {
    const filterValue = this.filterValue()?.toLowerCase() ?? ''
    const notSelectedGenres = this.availableGenres().filter(
      (genre) => !this.value().some((selectedGenre) => selectedGenre === genre.id),
    )

    return notSelectedGenres?.filter((genre) => genre.name.toLowerCase().includes(filterValue)) ?? []
  })
  protected readonly selectedGenres = computed(() => this.availableGenres().filter((g) => this.value().includes(g.id)))

  ngOnInit(): void {
    this.loadGenres()
  }

  private loadGenres(): void {
    this.loading.set(true)

    this.genreApi.getGenres().subscribe({
      next: (response) => {
        this.availableGenres.set(response.data)
        this.loading.set(false)
      },
      error: (error) => {
        if (error instanceof HttpErrorResponse) {
          console.error(error.error.message)
        } else {
          console.error('Failed to load genres')
        }

        this.loading.set(false)
      },
    })
  }

  protected addGenre(genreId: unknown): void {
    this.touched.set(true)

    const newGenre = this.availableGenres().find((g) => g.id === genreId)

    if (newGenre) {
      this.value.update((genres) => [...genres, newGenre.id])
    }

    this.filterValue.set('')
  }

  protected removeGenre(genreId: string): void {
    this.touched.set(true)
    this.value.update((genres) => genres.filter((g) => g !== genreId))
  }
}
