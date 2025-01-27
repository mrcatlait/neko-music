import { Test } from '@nestjs/testing'
import { PartiallyMocked } from 'vitest'

import { RegisterValidator } from './register.validator'
import { UserLoginDataRepository } from '../../../shared/repositories'
import { RegisterCommand } from './register.command'

describe('RegisterValidator', () => {
  let validator: RegisterValidator
  let userLoginDataRepositoryMock: PartiallyMocked<UserLoginDataRepository>

  beforeEach(async () => {
    userLoginDataRepositoryMock = {
      existsByEmail: vi.fn(),
    }

    const module = await Test.createTestingModule({
      providers: [RegisterValidator, { provide: UserLoginDataRepository, useValue: userLoginDataRepositoryMock }],
    }).compile()

    validator = module.get(RegisterValidator)
  })

  describe('validate', () => {
    it('should return true if email is not taken', async () => {
      // Arrange
      const command: RegisterCommand = {
        email: 'test@test.com',
        password: 'password',
      }
      userLoginDataRepositoryMock.existsByEmail?.mockResolvedValue(false)

      // Act
      const result = await validator.validate(command)

      // Assert
      expect(result.isValid).toBe(true)
    })

    it('should return false if email is taken', async () => {
      // Arrange
      const command: RegisterCommand = {
        email: 'test@test.com',
        password: 'password',
      }
      userLoginDataRepositoryMock.existsByEmail?.mockResolvedValue(true)

      // Act
      const result = await validator.validate(command)

      // Assert
      expect(result.isValid).toBe(false)
    })
  })
})
