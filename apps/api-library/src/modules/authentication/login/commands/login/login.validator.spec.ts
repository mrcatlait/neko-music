import { Test } from '@nestjs/testing'
import { PartiallyMocked } from 'vitest'
import { ConfigService } from '@nestjs/config'
import { hashSync } from 'bcrypt'

import { LoginValidator, LoginValidatorPayload } from './login.validator'

describe('LoginValidator', () => {
  let validator: LoginValidator
  let configServiceMock: PartiallyMocked<ConfigService>
  const saltRounds = 10

  beforeEach(async () => {
    configServiceMock = {
      get: vi.fn().mockReturnValue(saltRounds),
    }

    const module = await Test.createTestingModule({
      providers: [LoginValidator, { provide: ConfigService, useValue: configServiceMock }],
    }).compile()

    validator = module.get(LoginValidator)
  })

  describe('validate', () => {
    it('should return true if password is correct', () => {
      // Arrange
      const payload: LoginValidatorPayload = {
        password: 'password',
        passwordHash: hashSync('password', saltRounds),
      }

      // Act
      const result = validator.validate(payload)

      // Assert
      expect(result.isValid).toBe(true)
    })

    it('should return false if password is incorrect', () => {
      // Arrange
      const payload: LoginValidatorPayload = {
        password: 'password',
        passwordHash: hashSync('wrongPassword', saltRounds),
      }

      // Act
      const result = validator.validate(payload)

      // Assert
      expect(result.isValid).toBe(false)
    })

    it('should run dummy hash if password is not provided', () => {
      // Arrange
      const payload: LoginValidatorPayload = {
        password: 'password',
        passwordHash: undefined,
      }

      // Act
      const result = validator.validate(payload)

      // Assert
      expect(result.isValid).toBe(false)
    })
  })
})
