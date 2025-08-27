import { TestBed } from '@angular/core/testing'
import { provideZonelessChangeDetection } from '@angular/core'

import { SessionCookie } from './session-cookie'
import { Cookie } from './cookie'

describe('SessionCookie', () => {
  let sessionCookie: SessionCookie
  let cookieMock: Partial<Cookie>

  beforeEach(() => {
    cookieMock = {
      set: vi.fn(),
      delete: vi.fn(),
      get: vi.fn(),
    }

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        SessionCookie,
        {
          provide: Cookie,
          useValue: cookieMock,
        },
      ],
    })

    sessionCookie = TestBed.inject(SessionCookie)
  })

  describe('set', () => {
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
      sessionCookie.set()

      // Assert
      expect(cookieMock.set).toHaveBeenCalledWith(expectedParams)
    })
  })

  describe('delete', () => {
    it('should delete authentication cookie', () => {
      // Arrange
      const cookieName = 'is.authenticated'

      // Act
      sessionCookie.delete()

      // Assert
      expect(cookieMock.delete).toHaveBeenCalledWith(cookieName)
    })
  })

  describe('get', () => {
    it('should get authentication cookie value', () => {
      // Arrange
      const cookieName = 'is.authenticated'
      const expectedValue = 'true'
      cookieMock.get = vi.fn().mockReturnValue(expectedValue)

      // Act
      const result = sessionCookie.get()

      // Assert
      expect(cookieMock.get).toHaveBeenCalledWith(cookieName)
      expect(result).toBe(expectedValue)
    })
  })
})
