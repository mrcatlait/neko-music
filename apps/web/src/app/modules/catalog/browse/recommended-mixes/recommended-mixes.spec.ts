import { provideZonelessChangeDetection } from '@angular/core'
import { TestBed } from '@angular/core/testing'

import { RecommendedMixes } from './recommended-mixes'

describe('RecommendedMixes', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [RecommendedMixes],
      providers: [provideZonelessChangeDetection()],
    })

    await TestBed.compileComponents()
  })

  it('should render recommendation heading and cards from mocked data', () => {
    // Arrange
    const fixture = TestBed.createComponent(RecommendedMixes)

    // Act
    fixture.detectChanges()
    const element = fixture.nativeElement as HTMLElement

    // Assert
    const heading = element.querySelector('[data-testid="recommended-mixes-heading"]')
    const cards = element.querySelectorAll('[data-testid="recommended-mix-card"]')
    expect(heading?.textContent).toContain('several mixes for you')
    expect(cards.length).toBeGreaterThanOrEqual(2)
  })

  it('should render image and illustration background variants', () => {
    // Arrange
    const fixture = TestBed.createComponent(RecommendedMixes)

    // Act
    fixture.detectChanges()
    const element = fixture.nativeElement as HTMLElement

    // Assert
    const imageCard = element.querySelector('[data-testid="recommended-mix-card"][data-background-type="image"]')
    const illustrationCard = element.querySelector(
      '[data-testid="recommended-mix-card"][data-background-type="illustration"]',
    )
    expect(imageCard).toBeTruthy()
    expect(illustrationCard).toBeTruthy()
  })

  it('should render caption, title, and accessible play action in each card', () => {
    // Arrange
    const fixture = TestBed.createComponent(RecommendedMixes)

    // Act
    fixture.detectChanges()
    const element = fixture.nativeElement as HTMLElement

    // Assert
    const cards = [...element.querySelectorAll('[data-testid="recommended-mix-card"]')]
    expect(cards.length).toBeGreaterThan(0)

    for (const card of cards) {
      const caption = card.querySelector('[data-testid="recommended-mix-caption"]')
      const title = card.querySelector('[data-testid="recommended-mix-title"]')
      const playButton = card.querySelector<HTMLButtonElement>('[data-testid="recommended-mix-play"]')

      expect(caption?.textContent?.trim().length).toBeGreaterThan(0)
      expect(title?.textContent?.trim().length).toBeGreaterThan(0)
      expect(playButton).toBeTruthy()
      expect(playButton?.getAttribute('aria-label')).toContain('Play')
    }
  })
})
