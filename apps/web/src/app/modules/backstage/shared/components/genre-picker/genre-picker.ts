import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core'
import { Contracts } from '@neko/contracts'
import { form, FormField } from '@angular/forms/signals'
import { HttpErrorResponse } from '@angular/common/http'

import { GenreApi } from '../../services'

import { Autocomplete, AutocompleteOption, AutocompleteTrigger } from '@/shared/autocomplete'
import { InputChip, LoadingIndicator, Textfield } from '@/shared/components'

@Component({
  selector: 'n-genre-picker',
  templateUrl: './genre-picker.html',
  styleUrl: './genre-picker.scss',
  imports: [Autocomplete, AutocompleteOption, AutocompleteTrigger, InputChip, LoadingIndicator, FormField, Textfield],
  providers: [GenreApi],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenrePicker implements OnInit {
  private readonly genreApi = inject(GenreApi)

  readonly genres = input<string[]>()
  readonly selectionChange = output<string[]>()

  private readonly filterValue = signal<string>('')
  protected readonly filterForm = form(this.filterValue)

  private readonly availableGenres = signal<Contracts.Backstage.Genre[]>([])

  protected readonly loading = signal(false)
  protected readonly error = signal<string | null>(null)
  protected readonly selectedGenres = signal<Contracts.Backstage.Genre[]>([])
  protected readonly filteredGenres = computed(() => {
    const filterValue = this.filterValue()?.toLowerCase() ?? ''
    const notSelectedGenres = this.availableGenres().filter(
      (genre) => !this.selectedGenres().some((selectedGenre) => selectedGenre.id === genre.id),
    )

    return notSelectedGenres?.filter((genre) => genre.name.toLowerCase().includes(filterValue)) ?? []
  })

  constructor() {
    effect(() => {
      const genres = this.genres()

      if (!genres) {
        return
      }

      const genresToSelect = this.availableGenres().filter((g) => genres.includes(g.id))
      this.selectedGenres.set(genresToSelect)
    })
  }

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
          this.error.set(error.error.message)
        } else {
          this.error.set('Failed to load genres')
        }

        this.loading.set(false)
      },
    })
  }

  protected addGenre(genre: unknown): void {
    const newGenre = this.availableGenres().find((g) => g.id === (genre as string))

    if (newGenre) {
      this.selectedGenres.update((genres) => [...genres, newGenre])
      this.selectionChange.emit(this.selectedGenres().map((g) => g.id))
    }

    this.filterValue.set('')
  }

  protected removeGenre(genreId: string): void {
    this.selectedGenres.update((genres) => genres.filter((g) => g.id !== genreId))
    this.selectionChange.emit(this.selectedGenres().map((g) => g.id))
  }
}
