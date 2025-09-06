import { ChangeDetectionStrategy, Component, computed, inject, input, output, resource, signal } from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { HttpClient } from '@angular/common/http'
import { firstValueFrom } from 'rxjs'
import { Contracts } from '@neko/contracts'

import { Autocomplete, AutocompleteOption, AutocompleteTrigger } from '@/shared/autocomplete'
import { LoadingIndicator, Textfield, Button, InputChip } from '@/shared/components'
import { ENVIRONMENT } from '@/core/providers'
import { RECORD_STATUSES } from '@/domains/catalog-management/shared/enums'

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

  readonly formSubmit = output<{ name: string; genres: string[] }>()
  readonly formCancel = output<void>()

  readonly genresResource = resource({
    loader: () =>
      firstValueFrom(
        this.http.get<Contracts.CatalogManagement.GenreResponse[]>(
          `${this.environment.apiUrl}/catalog-management/genres?status=${RECORD_STATUSES.Published}`,
        ),
      ),
  })

  protected readonly form = new FormGroup({
    name: new FormControl('', [Validators.required]),
  })

  protected get name(): FormControl {
    return this.form.controls.name
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

  protected addGenre(genre: unknown): void {
    this.genres.set([...this.genres(), genre as string])
  }

  protected removeGenre(genreId: string): void {
    this.genres.set(this.genres().filter((g) => g !== genreId))
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }

    const name = this.form.controls.name.value
    const genres = this.genres()

    if (name) {
      this.formSubmit.emit({
        name,
        genres,
      })
    }
  }

  protected cancel(): void {
    this.formCancel.emit()
  }
}
