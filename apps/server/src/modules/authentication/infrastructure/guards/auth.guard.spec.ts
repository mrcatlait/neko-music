import { Test } from '@nestjs/testing'
import { PartiallyMocked } from 'vitest'
import { ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { AuthGuard } from './auth.guard'

describe('AuthGuard', () => {
  let guard: AuthGuard
  let reflectorMock: PartiallyMocked<Reflector>

  beforeEach(async () => {
    reflectorMock = {
      getAllAndOverride: vi.fn(),
    }

    const module = await Test.createTestingModule({
      providers: [AuthGuard, { provide: Reflector, useValue: reflectorMock }],
    }).compile()

    guard = module.get(AuthGuard)
  })

  describe('canActivate', () => {
    it('should allow access to public routes', () => {
      // Arrange
      const context = {
        getHandler: vi.fn(),
        getClass: vi.fn(),
        switchToHttp: vi.fn().mockReturnValue({
          getRequest: vi.fn().mockReturnValue({ session: { get: vi.fn() } }),
        }),
      } as unknown as ExecutionContext
      reflectorMock.getAllAndOverride?.mockReturnValue(true)

      // Act
      const result = guard.canActivate(context)

      // Assert
      expect(result).toBe(true)
    })

    it('should allow access when session data exists', () => {
      // Arrange
      const context = {
        getHandler: vi.fn(),
        getClass: vi.fn(),
        switchToHttp: vi.fn().mockReturnValue({
          getRequest: vi.fn().mockReturnValue({
            session: { get: vi.fn().mockReturnValue({ userId: '123' }) },
          }),
        }),
      } as unknown as ExecutionContext
      reflectorMock.getAllAndOverride?.mockReturnValue(false)

      // Act
      const result = guard.canActivate(context)

      // Assert
      expect(result).toBe(true)
    })

    it('should throw UnauthorizedException when session data is missing', () => {
      // Arrange
      const context = {
        getHandler: vi.fn(),
        getClass: vi.fn(),
        switchToHttp: vi.fn().mockReturnValue({
          getRequest: vi.fn().mockReturnValue({
            session: { get: vi.fn().mockReturnValue(null) },
          }),
        }),
      } as unknown as ExecutionContext
      reflectorMock.getAllAndOverride?.mockReturnValue(false)

      // Act & Assert
      expect(() => guard.canActivate(context)).toThrow(UnauthorizedException)
    })
  })
})
