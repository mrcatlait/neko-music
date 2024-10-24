import { TestBed } from '@angular/core/testing'
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { PartiallyMocked } from 'vitest'
import { Permission } from '@neko/permissions'

import { canActivateWithPermissions } from './can-activate-with-permissions.guard'

import { AuthState } from '@core/state'

describe('canActivateWithPermissions', () => {
  let authStateMock: PartiallyMocked<AuthState>

  const route = {} as ActivatedRouteSnapshot
  const state = {} as RouterStateSnapshot

  beforeEach(() => {
    authStateMock = {
      hasAllPermissions: vi.fn(),
    }

    TestBed.configureTestingModule({
      providers: [{ provide: AuthState, useValue: authStateMock }],
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should return true if user has all permissions', () => {
    // Arrange
    const permissions = [Permission.TrackRead]
    authStateMock.hasAllPermissions?.mockReturnValue(true)

    // Act
    const result = TestBed.runInInjectionContext(() => canActivateWithPermissions(permissions)(route, state))

    // Assert
    expect(result).toBe(true)
  })

  it('should return false if user does not have all permissions', () => {
    // Arrange
    const permissions = [Permission.TrackRead]
    authStateMock.hasAllPermissions?.mockReturnValue(false)

    // Act
    const result = TestBed.runInInjectionContext(() => canActivateWithPermissions(permissions)(route, state))

    // Assert
    expect(result).toBe(false)
  })
})
