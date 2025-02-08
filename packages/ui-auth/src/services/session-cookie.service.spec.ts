import { TestBed } from '@angular/core/testing'
import { CookieService } from '@neko/ui-shared'

import { SessionCookieService } from './session-cookie.service'

describe('SessionCookieService', () => {
  let service: SessionCookieService
  let cookieServiceMock: Partial<CookieService>

  beforeEach(() => {
    cookieServiceMock = {
      set: vi.fn(),
      delete: vi.fn(),
      get: vi.fn(),
    }

    TestBed.configureTestingModule({
      providers: [
        SessionCookieService,
        {
          provide: CookieService,
          useValue: cookieServiceMock,
        },
      ],
    })

    service = TestBed.inject(SessionCookieService)
  })

  describe('setCookie', () => {
    it('should set authentication cookie with correct parameters', () => {
      // Arrange
      const expectedParams = {
        name: 'is.authenticated',
        value: 'true',
        secure: true,
        sameSite: 'Strict',
        expires: 2,
      }

      // Act
      service.setCookie()

      // Assert
      expect(cookieServiceMock.set).toHaveBeenCalledWith(expectedParams)
    })
  })

  describe('deleteCookie', () => {
    it('should delete authentication cookie', () => {
      // Arrange
      const cookieName = 'is.authenticated'

      // Act
      service.deleteCookie()

      // Assert
      expect(cookieServiceMock.delete).toHaveBeenCalledWith(cookieName)
    })
  })

  describe('getCookie', () => {
    it('should get authentication cookie value', () => {
      // Arrange
      const cookieName = 'is.authenticated'
      const expectedValue = 'true'
      cookieServiceMock.get = vi.fn().mockReturnValue(expectedValue)

      // Act
      const result = service.getCookie()

      // Assert
      expect(cookieServiceMock.get).toHaveBeenCalledWith(cookieName)
      expect(result).toBe(expectedValue)
    })
  })
})
