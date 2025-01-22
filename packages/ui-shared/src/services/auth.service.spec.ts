import { TestBed } from '@angular/core/testing'
import { of, throwError } from 'rxjs'
import { PartiallyMocked } from 'vitest'

import { AuthService } from './auth.service'
import { SessionStorageService } from './session-storage.service'
import { SessionCookieService } from './session-cookie.service'
import { AuthRepository } from '../repositories'
import { Session } from '../models'

describe('AuthService', () => {
  let service: AuthService
  let sessionStorageServiceMock: PartiallyMocked<SessionStorageService>
  let sessionCookieServiceMock: PartiallyMocked<SessionCookieService>
  let authRepositoryMock: PartiallyMocked<AuthRepository>

  const mockSession: Session = {
    accessToken: 'accessToken',
  }

  beforeEach(() => {
    sessionStorageServiceMock = {
      set: vi.fn(),
      get: vi.fn(),
      remove: vi.fn(),
    }

    sessionCookieServiceMock = {
      getCookie: vi.fn(),
      setCookie: vi.fn(),
      deleteCookie: vi.fn(),
    }

    authRepositoryMock = {
      refreshToken: vi.fn(),
    }

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        {
          provide: SessionStorageService,
          useValue: sessionStorageServiceMock,
        },
        {
          provide: SessionCookieService,
          useValue: sessionCookieServiceMock,
        },
        {
          provide: AuthRepository,
          useValue: authRepositoryMock,
        },
      ],
    })

    service = TestBed.inject(AuthService)
  })

  describe('login', () => {
    it('should store session in storage', () => {
      // Arrange
      const session = mockSession

      // Act
      service.login(session)

      // Assert
      expect(sessionStorageServiceMock.set).toHaveBeenCalledWith(session)
    })
  })

  describe('logout', () => {
    it('should remove session from storage and delete cookie', () => {
      // Arrange

      // Act
      service.logout()

      // Assert
      expect(sessionStorageServiceMock.remove).toHaveBeenCalled()
      expect(sessionCookieServiceMock.deleteCookie).toHaveBeenCalled()
    })
  })

  describe('getSessionSilently', () => {
    it('should return null when no cookie exists', () => {
      // Arrange
      sessionCookieServiceMock.getCookie?.mockReturnValue(undefined)

      // Act
      const result = service.getSessionSilently()

      // Assert
      result.subscribe((session) => {
        expect(session).toBeNull()
      })
    })

    it('should return session from storage when it exists', () => {
      // Arrange
      sessionCookieServiceMock.getCookie?.mockReturnValue('cookie')
      sessionStorageServiceMock.get?.mockReturnValue(mockSession)

      // Act
      const result = service.getSessionSilently()

      // Assert
      result.subscribe((session) => {
        expect(session).toEqual(mockSession)
      })
    })

    it('should call getSessionUsingWhoAmI when cookie exists but no session in storage', () => {
      // Arrange
      sessionCookieServiceMock.getCookie?.mockReturnValue('cookie')
      sessionStorageServiceMock.get?.mockReturnValue(null)
      vi.spyOn(service, 'getSessionUsingWhoAmI').mockReturnValue(of(mockSession))

      // Act
      const result = service.getSessionSilently()

      // Assert
      result.subscribe((session) => {
        expect(session).toEqual(mockSession)
        expect(service.getSessionUsingWhoAmI).toHaveBeenCalled()
      })
    })
  })

  describe('getSessionUsingWhoAmI', () => {
    it('should store session and set cookie on successful whoAmI call', () => {
      // Arrange
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      authRepositoryMock.whoAmI?.mockReturnValue(of(mockSession as any))

      // Act
      const result = service.getSessionUsingWhoAmI()

      // Assert
      result.subscribe((session) => {
        expect(session).toEqual(mockSession)
        expect(sessionStorageServiceMock.set).toHaveBeenCalledWith(mockSession)
        expect(sessionCookieServiceMock.setCookie).toHaveBeenCalled()
      })
    })

    it('should return null on whoAmI error', () => {
      // Arrange
      authRepositoryMock.whoAmI?.mockReturnValue(throwError(() => new Error()))

      // Act
      const result = service.getSessionUsingWhoAmI()

      // Assert
      result.subscribe((session) => {
        expect(session).toBeNull()
      })
    })
  })
})
