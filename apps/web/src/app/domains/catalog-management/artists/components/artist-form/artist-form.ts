import { ChangeDetectionStrategy, Component, computed, inject, input, output, resource, signal } from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { HttpClient } from '@angular/common/http'
import { firstValueFrom, startWith } from 'rxjs'
import { Contracts } from '@neko/contracts'
import { toSignal } from '@angular/core/rxjs-interop'

import { Autocomplete, AutocompleteOption, AutocompleteTrigger } from '@/shared/autocomplete'
import { LoadingIndicator, Textfield, Button, InputChip } from '@/shared/components'
import { ENVIRONMENT } from '@/core/providers'
import { RECORD_STATUSES } from '@/domains/catalog-management/shared/enums'
import { PictureUpload } from '@/domains/catalog-management/shared/components'

interface Genre {
  value: string
  label: string
}

@Component({
  selector: 'n-artist-form',
  imports: [
    Autocomplete,
    AutocompleteOption,
    AutocompleteTrigger,
    Button,
    InputChip,
    LoadingIndicator,
    PictureUpload,
    ReactiveFormsModule,
    Textfield,
  ],
  templateUrl: './artist-form.html',
  styleUrl: './artist-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistForm {
  private readonly http = inject(HttpClient)
  private readonly environment = inject(ENVIRONMENT)

  readonly submitLabel = input.required<string>()
  readonly saving = input.required<boolean>()

  readonly formSubmit = output<{ name: string; genres: string[]; image: File }>()
  readonly formCancel = output<void>()

  protected readonly genresResource = resource({
    loader: () =>
      firstValueFrom(
        this.http.get<Contracts.CatalogManagement.GenreResponse[]>(
          `${this.environment.apiUrl}/catalog-management/genres?status=${RECORD_STATUSES.Published}`,
        ),
      ),
  })

  protected readonly form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    genreFilter: new FormControl('', []),
  })

  private readonly filterValue$ = this.genreFilter.valueChanges.pipe(startWith(this.genreFilter.value))
  readonly filterValue = toSignal(this.filterValue$)
  protected readonly availableGenres = computed(() => {
    const filterValue = this.filterValue()?.toLowerCase() ?? ''
    const notSelectedGenres = this.genresResource.value()?.filter((genre) => !this.genres().includes(genre.id))

    return notSelectedGenres?.filter((genre) => genre.name.toLowerCase().includes(filterValue)) ?? []
  })

  private image: File | null = null

  protected get name(): FormControl {
    return this.form.controls.name
  }

  protected get genreFilter(): FormControl {
    return this.form.controls.genreFilter
  }

  private readonly genres = signal<string[]>([])

  protected readonly selectedGenres = computed<Genre[]>(() => {
    const genresRef = this.genresResource.value()

    if (!genresRef) {
      return []
    }

    return this.genres().map((genre) => {
      const matchedGenre = genresRef.find((g) => g.id === genre)!

      return {
        value: matchedGenre.id,
        label: matchedGenre.name,
      }
    })
  })

  protected onSelectedFile(file: File): void {
    this.image = file
  }

  protected addGenre(genre: unknown): void {
    this.genres.set([...this.genres(), genre as string])
    this.genreFilter.setValue('')
  }

  protected removeGenre(genreId: string): void {
    this.genres.set(this.genres().filter((g) => g !== genreId))
  }

  protected submit(): void {
    if (this.form.invalid || !this.image) {
      this.form.markAllAsTouched()
      return
    }

    const name = this.form.controls.name.value
    const genres = this.selectedGenres().map((genre) => genre.value)

    if (name) {
      this.formSubmit.emit({
        name,
        genres,
        image: this.image,
      })
    }
  }

  protected cancel(): void {
    this.formCancel.emit()
  }
}
