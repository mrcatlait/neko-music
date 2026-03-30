import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  model,
  OnInit,
  signal,
} from '@angular/core'
import { form, FormField, FormValueControl, ValidationError, WithOptionalFieldTree } from '@angular/forms/signals'

import { Autocomplete, AutocompleteOption, AutocompleteTrigger } from '@/shared/autocomplete'
import { Textfield, LoadingIndicator, Chip } from '@/shared/components'
import { ArtworkPipe } from '@/shared/pipes'

interface FilterModel {
  value: string
}

@Component({
  selector: 'n-artist-autocomplete',
  templateUrl: './artist-autocomplete.html',
  styleUrl: './artist-autocomplete.scss',
  imports: [
    Textfield,
    Chip,
    Autocomplete,
    AutocompleteOption,
    AutocompleteTrigger,
    LoadingIndicator,
    FormField,
    ArtworkPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistAutocomplete implements FormValueControl<string[]>, OnInit {
  readonly value = model<string[]>([])
  readonly errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([])
  readonly disabled = input(false)
  readonly invalid = input(false)
  readonly touched = model(false)

  protected readonly loading = signal(false)

  private readonly availableArtists = signal<any[]>([])

  private readonly filterValue = signal<FilterModel>({ value: '' })
  protected readonly filterForm = form(this.filterValue)

  protected readonly filteredArtists = computed(() => {
    const filterValue = this.filterValue()?.value?.toLowerCase() ?? ''
    const notSelected = this.availableArtists().filter(
      (artist) => !this.value().some((selectedId) => selectedId === artist.id),
    )

    return notSelected.filter((artist) => artist.name.toLowerCase().includes(filterValue))
  })

  protected readonly selectedArtists = computed(() =>
    this.availableArtists().filter((a) => this.value().includes(a.id)),
  )

  constructor() {
    effect(() => {
      if (this.touched()) {
        this.filterForm.value().markAsTouched()
      }
    })
  }

  ngOnInit(): void {
    this.loadArtists()
  }

  private loadArtists(): void {
    this.loading.set(true)

    // this.artistApi.getArtists().subscribe({
    //   next: (response) => {
    //     this.availableArtists.set(response.data)
    //     this.loading.set(false)
    //   },
    //   error: (error: unknown) => {
    //     if (error instanceof HttpErrorResponse) {
    //       console.error(error.error?.message ?? error.message)
    //     } else {
    //       console.error('Failed to load artists')
    //     }

    //     this.loading.set(false)
    //   },
    // })
  }

  protected addArtist(artistId: unknown): void {
    this.touched.set(true)

    const artist = this.availableArtists().find((a) => a.id === artistId)

    if (artist) {
      this.value.update((ids) => [...ids, artist.id])
    }

    this.filterValue.set({ value: '' })
  }

  protected removeArtist(artistId: string): void {
    this.touched.set(true)
    this.value.update((ids) => ids.filter((id) => id !== artistId))
  }
}
