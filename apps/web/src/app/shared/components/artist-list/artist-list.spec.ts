import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ComponentRef, provideZonelessChangeDetection } from '@angular/core'
import { By } from '@angular/platform-browser'
import { provideRouter, RouterLink } from '@angular/router'
import { PartiallyMocked } from 'vitest'

import { ArtistList } from './artist-list'

import { UiStore } from '@/core/stores'
import { TrackArtist } from '@/shared/entities'
import { ARTIST_ROLES } from '@/shared/enums'

describe('ArtistList', () => {
  let component: ArtistList
  let componentRef: ComponentRef<ArtistList>
  let fixture: ComponentFixture<ArtistList>
  let uiStoreMock: PartiallyMocked<UiStore>

  // Test data builders
  const createTrackArtists = (): TrackArtist[] => [
    { id: '1', name: 'Artist One', role: ARTIST_ROLES.Primary },
    { id: '2', name: 'Artist Two', role: ARTIST_ROLES.Featuring },
    { id: '3', name: 'Artist Three', role: ARTIST_ROLES.Primary },
  ]

  beforeEach(() => {
    uiStoreMock = {
      touchDevice: vi.fn(),
    }

    fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), { provide: UiStore, useValue: uiStoreMock }, provideRouter([])],
      imports: [ArtistList],
    }).createComponent(ArtistList)

    component = fixture.componentInstance
    componentRef = fixture.componentRef
  })

  describe('accessibility', () => {
    it('should have proper aria-label for artists container', () => {
      // Arrange
      const artists = createTrackArtists()
      uiStoreMock.touchDevice?.mockReturnValue(false)
      componentRef.setInput('artists', artists)

      // Act
      fixture.detectChanges()

      // Assert
      const container = fixture.debugElement.query(By.css('span[aria-label="Artists"]'))
      expect(container).toBeTruthy()
    })

    it('should have aria-hidden separators', () => {
      // Arrange
      const artists = createTrackArtists()
      uiStoreMock.touchDevice?.mockReturnValue(false)
      componentRef.setInput('artists', artists)

      // Act
      fixture.detectChanges()

      // Assert
      const separators = fixture.debugElement.queryAll(By.css('span[aria-hidden="true"]'))
      // Should have 2 separators for 3 artists (n-1)
      expect(separators.length).toBe(2)
      separators.forEach((separator) => {
        expect(separator.nativeElement.textContent).toBe(',\u00A0') // comma + non-breaking space
      })
    })
  })

  describe('touch device', () => {
    it('should render artists as plain text spans', () => {
      // Arrange
      const artists = createTrackArtists()
      uiStoreMock.touchDevice?.mockReturnValue(true)
      componentRef.setInput('artists', artists)

      // Act
      fixture.detectChanges()

      // Assert
      const artistSpans = fixture.debugElement.queryAll(By.css('span:not([aria-hidden]):not([aria-label])'))
      expect(artistSpans.length).toBe(3)

      artistSpans.forEach((span, index) => {
        expect(span.nativeElement.textContent).toBe(artists[index].name)
      })

      // Should not have any router links
      const routerLinks = fixture.debugElement.queryAll(By.directive(RouterLink))
      expect(routerLinks.length).toBe(0)
    })

    it('should render separators between artists', () => {
      // Arrange
      const artists = createTrackArtists()
      uiStoreMock.touchDevice?.mockReturnValue(true)
      componentRef.setInput('artists', artists)

      // Act
      fixture.detectChanges()

      // Assert
      const separators = fixture.debugElement.queryAll(By.css('span[aria-hidden="true"]'))
      expect(separators.length).toBe(2) // n-1 separators for n artists
    })

    it('should not render separator after last artist', () => {
      // Arrange
      const artists = createTrackArtists()
      uiStoreMock.touchDevice?.mockReturnValue(true)
      componentRef.setInput('artists', artists)

      // Act
      fixture.detectChanges()

      // Assert
      const allElements = fixture.debugElement.nativeElement.children[0].children
      const lastElement = allElements[allElements.length - 1]
      expect(lastElement.textContent).toBe('Artist Three') // Last artist name, not a separator
    })
  })

  describe('non-touch device', () => {
    it('should render artists as links', () => {
      // Arrange
      const artists = createTrackArtists()
      uiStoreMock.touchDevice?.mockReturnValue(false)
      componentRef.setInput('artists', artists)

      // Act
      fixture.detectChanges()

      // Assert
      const routerLinks = fixture.debugElement.queryAll(By.directive(RouterLink))
      expect(routerLinks.length).toBe(3)

      routerLinks.forEach((link, index) => {
        const linkElement = link.nativeElement
        expect(linkElement.textContent).toBe(artists[index].name)
        expect(linkElement.title).toBe(artists[index].name)
        expect(linkElement.classList.contains('artist-list__link')).toBe(true)
      })
    })

    it('should render separators between artists', () => {
      // Arrange
      const artists = createTrackArtists()
      uiStoreMock.touchDevice?.mockReturnValue(false)
      componentRef.setInput('artists', artists)

      // Act
      fixture.detectChanges()

      // Assert
      const separators = fixture.debugElement.queryAll(By.css('span[aria-hidden="true"]'))
      expect(separators.length).toBe(2) // n-1 separators for n artists
    })

    it('should not render separator after last artist', () => {
      // Arrange
      const artists = createTrackArtists()
      uiStoreMock.touchDevice?.mockReturnValue(false)
      componentRef.setInput('artists', artists)

      // Act
      fixture.detectChanges()

      // Assert
      const allElements = fixture.debugElement.nativeElement.children[0].children
      const lastElement = allElements[allElements.length - 1]
      expect(lastElement.textContent).toBe('Artist Three') // Last artist name, not a separator
    })
  })

  describe('edge cases', () => {
    it('should handle empty artist list', () => {
      // Arrange
      uiStoreMock.touchDevice?.mockReturnValue(false)
      componentRef.setInput('artists', [])

      // Act
      fixture.detectChanges()

      // Assert
      const container = fixture.debugElement.query(By.css('span[aria-label="Artists"]'))
      expect(container).toBeTruthy()
      expect(container.nativeElement.children.length).toBe(0)
    })

    it('should handle single artist without separators', () => {
      // Arrange
      const artists: TrackArtist[] = [{ id: '1', name: 'Solo Artist', role: ARTIST_ROLES.Primary }]
      uiStoreMock.touchDevice?.mockReturnValue(false)
      componentRef.setInput('artists', artists)

      // Act
      fixture.detectChanges()

      // Assert
      const routerLinks = fixture.debugElement.queryAll(By.directive(RouterLink))
      expect(routerLinks.length).toBe(1)
      expect(routerLinks[0].nativeElement.textContent).toBe('Solo Artist')

      const separators = fixture.debugElement.queryAll(By.css('span[aria-hidden="true"]'))
      expect(separators.length).toBe(0)
    })
  })
})
