import { TestBed } from '@angular/core/testing'
import { PartiallyMocked } from 'vitest'
import { BehaviorSubject, fromEvent } from 'rxjs'

import { MediaQueryService } from './media-query.service'
import { Screens } from '../constants'
import { WINDOW } from '../providers'

const rxjsMock = vi.hoisted(() => {
  return {
    fromEvent: vi.fn(),
  }
})
vi.mock('rxjs', async () => {
  const actual = await vi.importActual('rxjs')
  return {
    ...actual,
    ...rxjsMock,
  }
})

describe('MediaQueryService', () => {
  let service: MediaQueryService
  let mockWindow: PartiallyMocked<Window>
  let mockFromEvent: BehaviorSubject<MediaQueryList>
  let mockMediaQueryList: MediaQueryList

  beforeEach(() => {
    mockMediaQueryList = {
      matches: true,
    } as unknown as MediaQueryList

    mockWindow = {
      matchMedia: vi.fn().mockReturnValue(mockMediaQueryList),
    }

    mockFromEvent = new BehaviorSubject(mockMediaQueryList)
    rxjsMock.fromEvent.mockReturnValue(mockFromEvent)

    TestBed.configureTestingModule({
      providers: [MediaQueryService, { provide: WINDOW, useValue: mockWindow }],
    })

    service = TestBed.inject(MediaQueryService)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('screen method', () => {
    it('should return a Signal<boolean> for a given screen size', () => {
      // Arrange
      mockWindow.matchMedia?.mockReturnValue(mockMediaQueryList)

      // Act
      const result = service.isCompactScreen()

      // Assert
      expect(result).toBe(true)
      expect(mockWindow.matchMedia).toHaveBeenCalledWith(Screens.Compact)
      expect(fromEvent).toHaveBeenCalledWith(mockMediaQueryList, 'change')
    })

    it('should reuse existing Signal for the same screen size', () => {
      // Arrange
      mockWindow.matchMedia?.mockReturnValue(mockMediaQueryList)

      // Act
      const result1 = service.isCompactScreen()
      const result2 = service.isCompactScreen()

      // Assert
      expect(result1).toBe(result2)
      expect(mockWindow.matchMedia).toHaveBeenCalledTimes(5) // Called 5 times for each screen size
      expect(fromEvent).toHaveBeenCalledTimes(5) // Called 5 times for each screen size
    })

    it('should update Signal when media query changes', () => {
      // Arrange
      mockWindow.matchMedia?.mockReturnValue(mockMediaQueryList)

      // Assert
      expect(service.isCompactScreen()).toBe(true)

      // Act
      mockMediaQueryList.matches = false
      mockFromEvent.next(mockMediaQueryList)

      // Assert
      expect(service.isCompactScreen()).toBe(false)
    })
  })

  describe('screen size properties', () => {
    const testCases = [
      { property: 'isCompactScreen', screen: Screens.Compact },
      { property: 'isMediumScreen', screen: Screens.Medium },
      { property: 'isExpandedScreen', screen: Screens.Expanded },
      { property: 'isLargeScreen', screen: Screens.Large },
      { property: 'isXLargeScreen', screen: Screens.XLarge },
    ]

    testCases.forEach(({ property, screen }) => {
      it(`should return correct Signal for ${property}`, () => {
        // Arrange
        mockWindow.matchMedia?.mockReturnValue(mockMediaQueryList)

        // Act
        const result = service[property as keyof MediaQueryService]

        // Assert
        expect(result()).toBe(true)
        expect(mockWindow.matchMedia).toHaveBeenCalledWith(screen)
        expect(fromEvent).toHaveBeenCalledWith(mockMediaQueryList, 'change')
      })
    })
  })
})
