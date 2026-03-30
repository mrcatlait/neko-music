import { ChangeDetectionStrategy, Component, effect, inject, input, model, OnInit, signal } from '@angular/core'
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop'
import { form, FormField, FormValueControl, ValidationError, WithOptionalFieldTree } from '@angular/forms/signals'
import { debounceTime, distinctUntilChanged, map, skip } from 'rxjs'

import { Autocomplete, AutocompleteOption, AutocompleteTrigger } from '@/shared/autocomplete'
import { Chip, IconButton, LoadingIndicator, Textfield } from '@/shared/components'
import { GetBackstageGenresByFilterGql } from '@/shared/generated-types'

interface GenreModel {
  id: string
  name: string
}

@Component({
  selector: 'n-genre-autocomplete',
  templateUrl: './genre-autocomplete.html',
  styleUrl: './genre-autocomplete.scss',
  imports: [
    Autocomplete,
    AutocompleteOption,
    AutocompleteTrigger,
    Chip,
    FormField,
    IconButton,
    LoadingIndicator,
    Textfield,
  ],
  providers: [GetBackstageGenresByFilterGql],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenreAutocomplete implements FormValueControl<string[]>, OnInit {
  private readonly getBackstageGenresByFilterGql = inject(GetBackstageGenresByFilterGql)

  readonly value = model<string[]>([])
  readonly errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([])
  readonly disabled = input(false)
  readonly invalid = input(false)
  readonly touched = model(false)

  protected readonly loading = signal(false)

  protected readonly genres = signal<GenreModel[]>([])

  private readonly filterValue = signal({ value: '' })
  protected readonly filterForm = form(this.filterValue)

  protected readonly selectedGenres = signal<GenreModel[]>([])

  constructor() {
    effect(() => {
      if (this.touched()) {
        this.filterForm.value().markAsTouched()
      }
    })

    toObservable(this.filterValue)
      .pipe(
        map((m) => m.value),
        skip(1),
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(),
      )
      .subscribe((trimmed) => this.loadGenresForSearch(trimmed))
  }

  ngOnInit(): void {
    if (this.value().length > 0) {
      this.getBackstageGenresByFilterGql
        .fetch({
          input: {
            pagination: {
              limit: 100,
            },
            filters: {
              ids: this.value(),
            },
          },
        })
        .then(({ data }) => {
          if (data) {
            this.selectedGenres.set(data.backstageGenres)
          }
        })
    }
  }

  private loadGenresForSearch(value: string): void {
    const trimmed = value.trim()
    const search = trimmed.length > 0 ? trimmed : undefined

    if (!search) {
      this.genres.set([])
      return
    }

    this.loading.set(true)

    this.getBackstageGenresByFilterGql
      .fetch({
        input: {
          pagination: {
            limit: 12,
          },
          filters: {
            search,
          },
        },
      })
      .then(({ error, data }) => {
        this.loading.set(false)

        if (error) {
          console.error(error)
        }

        if (data) {
          this.genres.set(data.backstageGenres)
        }
      })
  }

  protected addGenre(genreId: unknown): void {
    this.touched.set(true)

    const newGenre = this.genres().find((g) => g.id === genreId)

    if (newGenre) {
      this.value.update((genres) => [...genres, newGenre.id])
      this.selectedGenres.update((selectedGenres) => [...selectedGenres, newGenre])
    }

    this.filterValue.set({ value: '' })
    this.genres.set([])
  }

  protected removeGenre(genreId: string): void {
    this.touched.set(true)
    this.value.update((genres) => genres.filter((g) => g !== genreId))
    this.selectedGenres.update((selectedGenres) => selectedGenres.filter((g) => g.id !== genreId))
  }
}
