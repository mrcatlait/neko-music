import { Test } from '@nestjs/testing'
import { Reflector } from '@nestjs/core'
import { ExecutionContext } from '@nestjs/common'

import { PermissionGuard } from './permission.guard'
import { Permission } from '../constants'
import { PERMISSIONS_KEY } from '../decorators'
import { IS_PUBLIC_KEY } from '../../authentication/decorators/public.decorator'

describe('PermissionGuard', () => {
  let guard: PermissionGuard
  let reflector: Reflector

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PermissionGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: vi.fn(),
          },
        },
      ],
    }).compile()

    reflector = module.get(Reflector)
    guard = module.get(PermissionGuard)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('canActivate', () => {
    let mockContext: ExecutionContext

    beforeEach(() => {
      mockContext = {
        getHandler: vi.fn(),
        getClass: vi.fn(),
        switchToHttp: vi.fn().mockReturnValue({
          getRequest: vi.fn().mockReturnValue({ user: { permissions: [] } }),
        }),
        getArgs: vi.fn(),
        getArgByIndex: vi.fn(),
        switchToRpc: vi.fn(),
        switchToWs: vi.fn(),
        getType: vi.fn(),
      }
    })

    it('should return true if the route is public', () => {
      // Arrange
      vi.spyOn(reflector, 'getAllAndOverride').mockImplementation((key) => {
        if (key === IS_PUBLIC_KEY) {
          return true
        }
        return undefined
      })

      // Act
      const result = guard.canActivate(mockContext)

      // Assert
      expect(result).toBe(true)
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
        mockContext.getHandler(),
        mockContext.getClass(),
      ])
    })

    it('should return true if no required permissions are specified', () => {
      // Arrange
      vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined)

      // Act
      const result = guard.canActivate(mockContext)

      // Asset
      expect(result).toBe(true)
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(PERMISSIONS_KEY, [
        mockContext.getHandler(),
        mockContext.getClass(),
      ])
    })

    it('should return true if the user has at least one of the required permissions', () => {
      // Arrange
      const mockUser = { permissions: [Permission.ReadTrack, Permission.CreatePlaylist] }
      mockContext.switchToHttp().getRequest = vi.fn().mockReturnValue({ user: mockUser })

      vi.spyOn(reflector, 'getAllAndOverride').mockImplementation((key) => {
        if (key === PERMISSIONS_KEY) {
          return [Permission.CreatePlaylist]
        }
        return undefined
      })

      // Act
      const result = guard.canActivate(mockContext)

      // Assert
      expect(result).toBe(true)
    })

    it('should return false if the user does not have any of the required permissions', () => {
      // Arrange
      const mockUser = { permissions: [Permission.ReadTrack] }
      mockContext.switchToHttp().getRequest = vi.fn().mockReturnValue({ user: mockUser })

      vi.spyOn(reflector, 'getAllAndOverride').mockImplementation((key) => {
        if (key === PERMISSIONS_KEY) {
          return [Permission.CreatePlaylist]
        }
        return undefined
      })

      // Act
      const result = guard.canActivate(mockContext)

      // Assert
      expect(result).toBe(false)
    })
  })
})
