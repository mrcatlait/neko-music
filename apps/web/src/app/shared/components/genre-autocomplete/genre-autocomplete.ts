import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostListener,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { Contracts } from '@neko/contracts'

import { InputChip } from '../input-chip/input-chip'
import { Textfield } from '../textfield/textfield'

@Component({
  selector: 'n-genre-autocomplete',
  imports: [CommonModule, ReactiveFormsModule, InputChip, Textfield],
  templateUrl: './genre-autocomplete.html',
  styleUrl: './genre-autocomplete.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenreAutocomplete {
  readonly availableGenres = input.required<Contracts.CatalogManagement.GenreResponse[]>()
  readonly placeholder = input<string>('Search genres...')
  readonly disabled = input<boolean>(false)

  readonly genresChanged = output<Contracts.CatalogManagement.GenreResponse[]>()

  readonly selectedGenres = signal<Contracts.CatalogManagement.GenreResponse[]>([])
  readonly showDropdown = signal<boolean>(false)
  readonly searchControl = new FormControl('')

  private readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput')

  readonly filteredGenres = computed(() => {
    const searchTerm = this.searchControl.value?.toLowerCase() || ''
    const available = this.availableGenres()
    const selected = this.selectedGenres()

    return available
      .filter(
        (genre) =>
          !selected.some((selectedGenre) => selectedGenre.id === genre.id) &&
          genre.name.toLowerCase().includes(searchTerm),
      )
      .slice(0, 10) // Limit to 10 results for performance
  })

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement
    const isInsideComponent =
      this.searchInput()?.nativeElement.contains(target) || target.closest('.genre-autocomplete__dropdown')

    if (!isInsideComponent) {
      this.hideDropdown()
    }
  }

  showDropdownOnFocus(): void {
    if (!this.disabled()) {
      this.showDropdown.set(true)
    }
  }

  hideDropdown(): void {
    this.showDropdown.set(false)
  }

  selectGenre(genre: Contracts.CatalogManagement.GenreResponse): void {
    const currentSelected = this.selectedGenres()
    const newSelected = [...currentSelected, genre]

    this.selectedGenres.set(newSelected)
    this.searchControl.setValue('')
    this.hideDropdown()
    this.genresChanged.emit(newSelected)
  }

  removeGenre(genre: Contracts.CatalogManagement.GenreResponse): void {
    const currentSelected = this.selectedGenres()
    const newSelected = currentSelected.filter((g) => g.id !== genre.id)

    this.selectedGenres.set(newSelected)
    this.genresChanged.emit(newSelected)
  }
}
