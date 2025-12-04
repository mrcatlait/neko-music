import { Test } from '@nestjs/testing'

import { AuthService } from '../../services'
import { LoginValidator } from './login.validator'

describe('LoginValidator', () => {
  let validator: LoginValidator
  let authService: AuthService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        LoginValidator,
        {
          provide: AuthService,
          useValue: {
            generatePasswordHash: vi.fn().mockReturnValue('correct-hash'),
            generatePasswordSalt: vi.fn().mockReturnValue('salt'),
            comparePasswordHash: vi.fn(),
          },
        },
      ],
    }).compile()

    validator = moduleRef.get(LoginValidator)
    authService = moduleRef.get(AuthService)
  })

  describe('validate', () => {
    it('should return false if password hash is not provided', () => {
      // Act
      const result = validator.validate({ password: 'password123' })

      // Assert
      expect(result).toEqual({ isValid: false, errors: ['Invalid credentials'] })
    })

    it('should return false if password is incorrect', () => {
      // Arrange
      vi.mocked(authService.comparePasswordHash).mockReturnValue(false)

      // Act
      const result = validator.validate({ password: 'password123', passwordHash: 'correct-hash' })

      // Assert
      expect(result).toEqual({ isValid: false, errors: ['Invalid credentials'] })
    })

    it('should return true if password is correct', () => {
      // Arrange
      vi.mocked(authService.comparePasswordHash).mockReturnValue(true)

      // Act
      const result = validator.validate({ password: 'password123', passwordHash: 'correct-hash' })

      // Assert
      expect(result).toEqual({ isValid: true, errors: [] })
    })
  })
})
