import { CanActivate, ExecutionContext } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'

import { JwtAuthGuard } from './jwt-auth.guard'
import { IS_PUBLIC_KEY } from '../decorators'

vi.mock('@nestjs/passport', () => {
  const authGuardClass = class AuthGuardClass implements CanActivate {
    canActivate() {
      return true
    }
  }

  return {
    AuthGuard: vi.fn().mockImplementation(() => authGuardClass),
  }
})

describe('JwtAuthGuard', () => {
  let jwtAuthGuard: JwtAuthGuard
  let reflector: Reflector

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: vi.fn(),
          },
        },
      ],
    }).compile()

    jwtAuthGuard = module.get(JwtAuthGuard)
    reflector = module.get(Reflector)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('canActivate', () => {
    const context: ExecutionContext = {
      getHandler: vi.fn(),
      getClass: vi.fn(),
      switchToHttp: vi.fn(),
      getArgs: vi.fn(),
      getArgByIndex: vi.fn(),
      switchToRpc: vi.fn(),
      switchToWs: vi.fn(),
      getType: vi.fn(),
    }

    it('should return true if the handler or class is marked as public', () => {
      // Arrange
      const isPublic = true
      vi.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(isPublic)

      // Act
      const result = jwtAuthGuard.canActivate(context)

      // Assert
      expect(result).toBe(true)
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ])
    })

    it('should call the super canActivate method if not marked as public', () => {
      // Arrange
      const isPublic = false
      vi.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(isPublic)

      // Act
      const result = jwtAuthGuard.canActivate(context)

      // Assert
      expect(result).toBe(true)
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ])
    })
  })
})
