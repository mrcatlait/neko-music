import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ReactiveFormsModule } from '@angular/forms'
import { provideZonelessChangeDetection } from '@angular/core'

import { GenreAutocomplete } from './genre-autocomplete'
import { InputChip } from '../input-chip/input-chip'
import { Textfield } from '../textfield/textfield'

describe('GenreAutocomplete', () => {
  let component: GenreAutocomplete
  let fixture: ComponentFixture<GenreAutocomplete>

  const mockGenres = [
    { id: '1', name: 'Rock', status: 'published' },
    { id: '2', name: 'Jazz', status: 'published' },
    { id: '3', name: 'Electronic', status: 'published' },
    { id: '4', name: 'Classical', status: 'published' },
  ]

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenreAutocomplete, ReactiveFormsModule, InputChip, Textfield],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents()

    fixture = TestBed.createComponent(GenreAutocomplete)
    component = fixture.componentInstance
    // Set required input
    fixture.componentRef.setInput('availableGenres', mockGenres)
  })

  describe('when initialized', () => {
    it('should create component', () => {
      // Arrange & Act
      fixture.detectChanges()

      // Assert
      expect(component).toBeTruthy()
    })

    it('should initialize with empty selected genres', () => {
      // Arrange & Act
      fixture.detectChanges()

      // Assert
      expect(component.selectedGenres()).toEqual([])
    })

    it('should not show dropdown initially', () => {
      // Arrange & Act
      fixture.detectChanges()

      // Assert
      expect(component.showDropdown()).toBe(false)
    })
  })

  describe('when interacting with genres', () => {
    beforeEach(() => {
      fixture.detectChanges()
    })

    it('should filter genres based on search term', () => {
      // Arrange
      component.searchControl.setValue('ro')

      // Act
      fixture.detectChanges()

      // Assert
      expect(component.filteredGenres()).toEqual([{ id: '1', name: 'Rock', status: 'published' }])
    })

    it('should add genre to selected list when selected', () => {
      // Arrange
      const genreToSelect = mockGenres[0]

      // Act
      component.selectGenre(genreToSelect)

      // Assert
      expect(component.selectedGenres()).toContain(genreToSelect)
    })

    it('should remove genre from selected list when removed', () => {
      // Arrange
      component.selectedGenres.set([mockGenres[0], mockGenres[1]])
      const genreToRemove = mockGenres[0]

      // Act
      component.removeGenre(genreToRemove)

      // Assert
      expect(component.selectedGenres()).not.toContain(genreToRemove)
      expect(component.selectedGenres()).toContain(mockGenres[1])
    })

    it('should clear search input after selection', () => {
      // Arrange
      component.searchControl.setValue('rock')
      const genreToSelect = mockGenres[0]

      // Act
      component.selectGenre(genreToSelect)

      // Assert
      expect(component.searchControl.value).toBe('')
    })

    it('should hide dropdown after selection', () => {
      // Arrange
      component.showDropdown.set(true)
      const genreToSelect = mockGenres[0]

      // Act
      component.selectGenre(genreToSelect)

      // Assert
      expect(component.showDropdown()).toBe(false)
    })
  })
})
