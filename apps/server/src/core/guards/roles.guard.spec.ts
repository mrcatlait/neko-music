import { Test } from '@nestjs/testing'
import { Reflector } from '@nestjs/core'
import { ExecutionContext } from '@nestjs/common'

import { RolesGuard } from './roles.guard'

import { Role } from '@core/models'

describe('RolesGuard', () => {
  let rolesGuard: RolesGuard
  let reflector: Reflector

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: vi.fn(),
          },
        },
      ],
    }).compile()

    reflector = module.get(Reflector)
    rolesGuard = module.get(RolesGuard)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('canActivate', () => {
    it('should return true if no required roles are specified', () => {
      // Arrange
      const getRequest = vi.fn().mockImplementation(() => ({ user: { roles: [Role.Admin] } }))
      const context: ExecutionContext = {
        getHandler: vi.fn(),
        getClass: vi.fn(),
        switchToHttp: vi.fn().mockImplementation(() => ({ getRequest })),
        getArgs: vi.fn(),
        getArgByIndex: vi.fn(),
        switchToRpc: vi.fn(),
        switchToWs: vi.fn(),
        getType: vi.fn(),
      }
      vi.spyOn(reflector, 'getAllAndOverride').mockImplementation(() => null)

      // Act
      const result = rolesGuard.canActivate(context)

      // Assert
      expect(result).toBe(true)
    })

    it('should return true if the user has at least one of the required roles', () => {
      // Arrange
      const getRequest = vi.fn().mockImplementation(() => ({ user: { roles: [Role.Admin, Role.User] } }))
      const context: ExecutionContext = {
        getHandler: vi.fn(),
        getClass: vi.fn(),
        switchToHttp: vi.fn().mockImplementation(() => ({ getRequest })),
        getArgs: vi.fn(),
        getArgByIndex: vi.fn(),
        switchToRpc: vi.fn(),
        switchToWs: vi.fn(),
        getType: vi.fn(),
      }
      const requiredRoles: Role[] = [Role.Admin]
      vi.spyOn(reflector, 'getAllAndOverride').mockImplementation(() => requiredRoles)

      // Act
      const result = rolesGuard.canActivate(context)

      // Assert
      expect(result).toBe(true)
    })

    it('should return false if the user does not have any of the required roles', () => {
      // Arrange
      const getRequest = vi.fn().mockImplementation(() => ({ user: { roles: [Role.User] } }))
      const context: ExecutionContext = {
        getHandler: vi.fn(),
        getClass: vi.fn(),
        switchToHttp: vi.fn().mockImplementation(() => ({ getRequest })),
        getArgs: vi.fn(),
        getArgByIndex: vi.fn(),
        switchToRpc: vi.fn(),
        switchToWs: vi.fn(),
        getType: vi.fn(),
      }
      const requiredRoles: Role[] = [Role.Admin]
      vi.spyOn(reflector, 'getAllAndOverride').mockImplementation(() => requiredRoles)

      // Act
      const result = rolesGuard.canActivate(context)

      // Assert
      expect(result).toBe(false)
    })
  })
})
