import { Test } from '@nestjs/testing'
import { ExecutionContext, UnauthorizedException } from '@nestjs/common'

import { AuthGuard } from './auth.guard'

describe('AuthGuard', () => {
  let guard: AuthGuard

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AuthGuard],
    }).compile()

    guard = module.get(AuthGuard)
  })

  describe('canActivate', () => {
    it('should allow access when session data exists', () => {
      // Arrange
      const context = {
        switchToHttp: vi.fn().mockReturnValue({
          getRequest: vi.fn().mockReturnValue({
            session: { get: vi.fn().mockReturnValue({ userId: '123' }) },
          }),
        }),
      } as unknown as ExecutionContext

      // Act
      const result = guard.canActivate(context)

      // Assert
      expect(result).toBe(true)
    })

    it('should throw UnauthorizedException when session data is missing', () => {
      // Arrange
      const context = {
        switchToHttp: vi.fn().mockReturnValue({
          getRequest: vi.fn().mockReturnValue({
            session: { get: vi.fn().mockReturnValue(null) },
          }),
        }),
      } as unknown as ExecutionContext

      // Act & Assert
      expect(() => guard.canActivate(context)).toThrow(UnauthorizedException)
    })
  })
})
