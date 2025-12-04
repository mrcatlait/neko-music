import { Test } from '@nestjs/testing'

import { AuthRepository } from '../../repositories'
import { RegisterUserValidator } from './register-user.validator'
import { RegisterUserUseCaseParams } from './register-user.use-case'

describe('RegisterUserUseCase', () => {
  let validator: RegisterUserValidator
  let authRepository: AuthRepository

  const params: RegisterUserUseCaseParams = {
    email: 'test@example.com',
    password: 'password123',
    displayName: 'Test User',
  }

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        RegisterUserValidator,
        {
          provide: AuthRepository,
          useValue: {
            accountExistsByEmail: vi.fn(),
          },
        },
      ],
    }).compile()

    validator = moduleRef.get(RegisterUserValidator)
    authRepository = moduleRef.get(AuthRepository)
  })

  describe('validate', () => {
    it('should return true if email does not exist', async () => {
      // Arrange
      vi.mocked(authRepository.accountExistsByEmail).mockResolvedValue(false)

      // Act
      const result = await validator.validate(params)

      // Assert
      expect(result).toEqual({ isValid: true, errors: [] })
    })

    it('should return false if email exists', async () => {
      // Arrange
      vi.mocked(authRepository.accountExistsByEmail).mockResolvedValue(true)

      // Act
      const result = await validator.validate(params)

      // Assert
      expect(result).toEqual({ isValid: false, errors: ['emailTaken'] })
    })
  })
})
