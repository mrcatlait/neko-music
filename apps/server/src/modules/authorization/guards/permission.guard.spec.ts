import { describe, it, expect, beforeEach, PartiallyMocked } from 'vitest'
import { ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Permission } from '@neko/permissions'
import { Test } from '@nestjs/testing'

import { PermissionGuard } from './permission.guard'

describe('PermissionGuard', () => {
  let guard: PermissionGuard
  let reflectorMock: PartiallyMocked<Reflector>
  let executionContextMock: PartiallyMocked<ExecutionContext>

  beforeEach(async () => {
    reflectorMock = {
      getAllAndOverride: vi.fn(),
    }

    const module = await Test.createTestingModule({
      providers: [PermissionGuard, { provide: Reflector, useValue: reflectorMock }],
    }).compile()

    executionContextMock = {
      getHandler: vi.fn(),
      getClass: vi.fn(),
      switchToHttp: vi.fn().mockReturnValue({
        getRequest: vi.fn(),
      }),
    }

    guard = module.get(PermissionGuard)
  })

  describe('canActivate', () => {
    it('should throw UnauthorizedException when user is not in session', () => {
      // Arrange
      reflectorMock.getAllAndOverride?.mockReturnValue([Permission.TrackRead])
      executionContextMock.switchToHttp = vi.fn().mockReturnValue({
        getRequest: vi.fn().mockReturnValue({
          session: {
            get: vi.fn().mockReturnValue(null),
          },
        }),
      })

      // Act & Assert
      expect(() => guard.canActivate(executionContextMock as unknown as ExecutionContext)).toThrow(
        UnauthorizedException,
      )
    })

    it('should return true when user has all required permissions', () => {
      // Arrange
      reflectorMock.getAllAndOverride?.mockReturnValue([Permission.TrackRead, Permission.TrackUpdate])

      executionContextMock.switchToHttp = vi.fn().mockReturnValue({
        getRequest: vi.fn().mockReturnValue({
          session: {
            get: vi.fn().mockReturnValue({
              permissions: [Permission.TrackRead, Permission.TrackUpdate],
            }),
          },
        }),
      })

      // Act
      const result = guard.canActivate(executionContextMock as unknown as ExecutionContext)

      // Assert
      expect(result).toBe(true)
    })

    it('should return false when user does not have all required permissions', () => {
      // Arrange
      reflectorMock.getAllAndOverride?.mockReturnValue([Permission.TrackRead, Permission.TrackUpdate])
      executionContextMock.switchToHttp = vi.fn().mockReturnValue({
        getRequest: vi.fn().mockReturnValue({
          session: {
            get: vi.fn().mockReturnValue({
              permissions: [Permission.TrackRead],
            }),
          },
        }),
      })

      // Act
      const result = guard.canActivate(executionContextMock as unknown as ExecutionContext)

      // Assert
      expect(result).toBe(false)
    })
  })
})
