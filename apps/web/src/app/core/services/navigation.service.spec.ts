import { describe, it, expect, beforeEach, PartiallyMocked } from 'vitest'
import { NavigationEnd, Router } from '@angular/router'
import { Location } from '@angular/common'
import { Subject } from 'rxjs'
import { TestBed } from '@angular/core/testing'

import { NavigationService } from './navigation.service'

describe('NavigationService', () => {
  let service: NavigationService
  let routerMock: Omit<PartiallyMocked<Router>, 'events'> & { events: Subject<NavigationEnd> }
  let locationMock: PartiallyMocked<Location>

  beforeEach(() => {
    routerMock = {
      events: new Subject(),
      navigateByUrl: vi.fn(),
    }
    locationMock = {
      back: vi.fn(),
    }

    TestBed.configureTestingModule({
      providers: [
        NavigationService,
        { provide: Router, useValue: routerMock },
        { provide: Location, useValue: locationMock },
      ],
    })

    service = TestBed.inject(NavigationService)
  })

  describe('constructor', () => {
    it('should subscribe to router events', () => {
      // Arrange
      const url = '/test'
      const navigationEnd = new NavigationEnd(1, url, url)

      // Act
      routerMock.events?.next(navigationEnd)

      // Assert
      expect(service['history']).toContain(url)
    })
  })

  describe('back', () => {
    it('should call location.back() when history has more than one item', () => {
      // Arrange
      const url1 = '/test1'
      const url2 = '/test2'
      routerMock.events?.next(new NavigationEnd(1, url1, url1))
      routerMock.events?.next(new NavigationEnd(2, url2, url2))

      // Act
      service.back()

      // Assert
      expect(locationMock.back).toHaveBeenCalled()
      expect(routerMock.navigateByUrl).not.toHaveBeenCalled()
    })

    it('should navigate to root when history has only one item', () => {
      // Arrange
      const url = '/test'
      routerMock.events?.next(new NavigationEnd(1, url, url))

      // Act
      service.back()

      // Assert
      expect(locationMock.back).not.toHaveBeenCalled()
      expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/')
    })
  })
})
