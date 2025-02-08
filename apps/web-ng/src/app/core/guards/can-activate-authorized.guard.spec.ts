import { TestBed } from '@angular/core/testing'
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router'
import { PartiallyMocked } from 'vitest'

import { canActivateAuthorized } from './can-activate-authorized.guard'

import { AuthState } from '@core/state'
import { ENVIRONMENT } from '@core/tokens'
import { Environment } from '@core/models'

describe('canActivateAuthorized', () => {
  let authStateMock: PartiallyMocked<AuthState>
  let routerMock: PartiallyMocked<Router>
  let environmentMock: PartiallyMocked<Environment>

  const route = {} as ActivatedRouteSnapshot
  const state = {} as RouterStateSnapshot

  beforeEach(() => {
    authStateMock = {
      isAuthenticated: vi.fn(),
    }

    routerMock = {
      navigate: vi.fn(),
    }

    environmentMock = {
      private: true,
    }

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthState, useValue: authStateMock },
        { provide: Router, useValue: routerMock },
        { provide: ENVIRONMENT, useValue: environmentMock },
      ],
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should return true if user is authenticated', () => {
    // Arrange
    authStateMock.isAuthenticated?.mockReturnValue(true)

    // Act
    const result = TestBed.runInInjectionContext(() => canActivateAuthorized(route, state))

    // Assert
    expect(result).toBe(true)
    expect(routerMock.navigate).not.toHaveBeenCalled()
  })

  it('should navigate to login if user is not authenticated', () => {
    // Arrange
    authStateMock.isAuthenticated?.mockReturnValue(false)

    // Act
    const result = TestBed.runInInjectionContext(() => canActivateAuthorized(route, state))

    // Assert
    expect(result).toBe(false)
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login'])
  })
})
