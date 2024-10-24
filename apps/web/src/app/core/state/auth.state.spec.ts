import { TestBed } from '@angular/core/testing'
import { PartiallyMocked } from 'vitest'
import { of, throwError } from 'rxjs'
import { Permission } from '@neko/permissions'

import { AuthState } from './auth.state'

import { AuthRepository } from '@core/repositories'
import { CookieService } from '@core/services'

describe('AuthState', () => {
  let authState: AuthState
  let authRepositoryMock: PartiallyMocked<AuthRepository>
  let cookieServiceMock: PartiallyMocked<CookieService>

  const mockSession = {
    user: { id: '1', username: 'testuser' },
    permissions: [Permission.TrackRead, Permission.TrackCreate],
  }

  beforeEach(() => {
    authRepositoryMock = {
      whoAmI: vi.fn(),
      logout: vi.fn(),
    }

    cookieServiceMock = {
      get: vi.fn(),
      set: vi.fn(),
      delete: vi.fn(),
    }

    TestBed.configureTestingModule({
      providers: [
        AuthState,
        { provide: AuthRepository, useValue: authRepositoryMock },
        { provide: CookieService, useValue: cookieServiceMock },
      ],
    })

    authState = TestBed.inject(AuthState)
  })

  describe('login', () => {
    it('should set the session', () => {
      // Arrange
      const setSessionSpy = vi.spyOn(authState as any, 'setSession')

      // Act
      authState.login(mockSession)

      // Assert
      expect(setSessionSpy).toHaveBeenCalledWith(mockSession)
      expect(authState.session()).toEqual(mockSession)
      expect(authState.isAuthenticated()).toBe(true)
    })
  })

  describe('logout', () => {
    it('should clear the session and perform logout actions', () => {
      // Arrange
      authState.login(mockSession)

      // Act
      authState.logout()

      // Assert
      expect(authState.session()).toBeNull()
      expect(authState.isAuthenticated()).toBe(false)
      expect(cookieServiceMock.delete).toHaveBeenCalledWith('is.authenticated')
      expect(authRepositoryMock.logout).toHaveBeenCalled()
    })
  })

  describe('checkSession', () => {
    it('should not get session if not authenticated', () => {
      // Arrange
      cookieServiceMock.get?.mockReturnValue(undefined)
      const getSessionSilentlySpy = vi.spyOn(authState as any, 'getSessionSilently')

      // Act
      authState.checkSession()

      // Assert
      expect(getSessionSilentlySpy).not.toHaveBeenCalled()
    })

    it('should get session silently if authenticated', () => {
      // Arrange
      cookieServiceMock.get?.mockReturnValue('true')
      const getSessionSilentlySpy = vi.spyOn(authState as any, 'getSessionSilently')

      // Act
      authState.checkSession()

      // Assert
      expect(getSessionSilentlySpy).toHaveBeenCalled()
    })
  })

  describe('hasPermission', () => {
    it('should return true if user has the permission', () => {
      // Arrange
      authState.login(mockSession)

      // Act & Assert
      expect(authState.hasPermission(Permission.TrackRead)).toBe(true)
    })

    it('should return false if user does not have the permission', () => {
      // Arrange
      authState.login(mockSession)

      // Act & Assert
      expect(authState.hasPermission(Permission.TrackDelete)).toBe(false)
    })
  })

  describe('hasAnyPermission', () => {
    it('should return true if user has any of the permissions', () => {
      // Arrange
      authState.login(mockSession)

      // Act & Assert
      expect(authState.hasAnyPermission([Permission.TrackRead, Permission.TrackDelete])).toBe(true)
    })

    it('should return false if user has none of the permissions', () => {
      // Arrange
      authState.login(mockSession)

      // Act & Assert
      expect(authState.hasAnyPermission([Permission.TrackDelete, Permission.TrackUpdate])).toBe(false)
    })
  })

  describe('hasAllPermissions', () => {
    it('should return true if user has all the permissions', () => {
      // Arrange
      authState.login(mockSession)

      // Act & Assert
      expect(authState.hasAllPermissions([Permission.TrackRead, Permission.TrackCreate])).toBe(true)
    })

    it('should return false if user does not have all the permissions', () => {
      // Arrange
      authState.login(mockSession)

      // Act & Assert
      expect(authState.hasAllPermissions([Permission.TrackRead, Permission.TrackDelete])).toBe(false)
    })
  })

  describe('getSessionSilently', () => {
    it('should use cached session if available', async () => {
      // Arrange
      const getSessionFromCacheSpy = vi.spyOn(authState as any, 'getSessionFromCache').mockReturnValue(mockSession)
      const setSessionSpy = vi.spyOn(authState as any, 'setSession')

      // Act
      await (authState as any).getSessionSilently()

      // Assert
      expect(getSessionFromCacheSpy).toHaveBeenCalled()
      expect(setSessionSpy).toHaveBeenCalledWith(mockSession)
    })

    it('should call whoAmI if no cached session', async () => {
      // Arrange
      vi.spyOn(authState as any, 'getSessionFromCache').mockReturnValue(null)
      const getSessionUsingWhoAmISpy = vi.spyOn(authState as any, 'getSessionUsingWhoAmI')

      // Act
      await (authState as any).getSessionSilently()

      // Assert
      expect(getSessionUsingWhoAmISpy).toHaveBeenCalled()
    })
  })

  describe('getSessionUsingWhoAmI', () => {
    it('should set session on successful whoAmI', async () => {
      // Arrange
      authRepositoryMock.whoAmI?.mockReturnValue(of(mockSession))
      const saveSessionInCacheSpy = vi.spyOn(authState as any, 'saveSessionInCache')
      const setSessionSpy = vi.spyOn(authState as any, 'setSession')

      // Act
      await (authState as any).getSessionUsingWhoAmI()

      // Assert
      expect(saveSessionInCacheSpy).toHaveBeenCalledWith(mockSession)
      expect(setSessionSpy).toHaveBeenCalledWith(mockSession)
    })

    it('should logout on whoAmI error', async () => {
      // Arrange
      authRepositoryMock.whoAmI?.mockReturnValue(throwError(() => new Error('WhoAmI failed')))
      const logoutSpy = vi.spyOn(authState, 'logout')

      // Act
      await (authState as any).getSessionUsingWhoAmI()

      // Assert
      expect(logoutSpy).toHaveBeenCalled()
    })
  })
})
