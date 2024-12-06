import { TestBed } from '@angular/core/testing'
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router'
import { PartiallyMocked } from 'vitest'

import { canActivateGuest } from './can-activate-guest.guard'

import { AuthState } from '@core/state'

describe('canActivateGuest', () => {
  let authStateMock: PartiallyMocked<AuthState>
  let routerMock: PartiallyMocked<Router>

  const route = {} as ActivatedRouteSnapshot
  const state = {} as RouterStateSnapshot

  beforeEach(() => {
    authStateMock = {
      isAuthenticated: vi.fn(),
    }

    routerMock = {
      navigate: vi.fn(),
    }

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthState, useValue: authStateMock },
        { provide: Router, useValue: routerMock },
      ],
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should return true if user is not authenticated', () => {
    // Arrange
    authStateMock.isAuthenticated?.mockReturnValue(false)

    // Act
    const result = TestBed.runInInjectionContext(() => canActivateGuest(route, state))

    // Assert
    expect(result).toBe(true)
    expect(routerMock.navigate).not.toHaveBeenCalled()
  })

  it('should navigate to root if user is authenticated', () => {
    // Arrange
    authStateMock.isAuthenticated?.mockReturnValue(true)

    // Act
    const result = TestBed.runInInjectionContext(() => canActivateGuest(route, state))

    // Assert
    expect(result).toBe(false)
    expect(routerMock.navigate).toHaveBeenCalledWith(['/'])
  })
})
