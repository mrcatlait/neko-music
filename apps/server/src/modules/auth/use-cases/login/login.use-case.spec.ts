import { Test } from '@nestjs/testing'
import { UnauthorizedException } from '@nestjs/common'

import { AuthService } from '../../services'
import { LoginUseCase } from './login.use-case'
import { LoginValidator } from './login.validator'
import { AuthRepository } from '../../repositories'

import { GetUserProfileUseCase } from '@/modules/user/use-cases'

describe('LoginUseCase', () => {
  let useCase: LoginUseCase
  let authService: AuthService
  let authRepository: AuthRepository
  let loginValidator: LoginValidator
  let getUserProfileUseCase: GetUserProfileUseCase

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        LoginUseCase,
        {
          provide: AuthRepository,
          useValue: {
            findAccountWithCredentialsByEmail: vi.fn(),
          },
        },
        {
          provide: LoginValidator,
          useValue: {
            validate: vi.fn(),
          },
        },
        {
          provide: GetUserProfileUseCase,
          useValue: {
            invoke: vi.fn(),
          },
        },
        {
          provide: AuthService,
          useValue: {
            generatePasswordHash: vi.fn().mockReturnValue('correct-hash'),
            generatePasswordSalt: vi.fn().mockReturnValue('salt'),
            comparePasswordHash: vi.fn(),
            generateTokenPair: vi.fn(),
          },
        },
      ],
    }).compile()

    useCase = moduleRef.get(LoginUseCase)
    authService = moduleRef.get(AuthService)
    authRepository = moduleRef.get(AuthRepository)
    loginValidator = moduleRef.get(LoginValidator)
    getUserProfileUseCase = moduleRef.get(GetUserProfileUseCase)
  })

  describe('invoke', () => {
    it('should throw an error if the email is not found', async () => {
      // Arrange
      vi.mocked(authRepository.findAccountWithCredentialsByEmail).mockResolvedValue(undefined)
      vi.mocked(loginValidator.validate).mockImplementation(() => {
        throw new UnauthorizedException('Invalid credentials')
      })

      // Act & Assert
      await expect(useCase.invoke({ email: 'test@example.com', password: 'password123' })).rejects.toThrow(
        UnauthorizedException,
      )
    })

    it('should throw an error if the password is incorrect', async () => {
      // Arrange
      vi.mocked(authRepository.findAccountWithCredentialsByEmail).mockResolvedValue({
        id: 'user-1',
        emailAddress: 'test@example.com',
        passwordHash: 'correct-hash',
        passwordSalt: 'salt',
        role: 'role-1',
      })
      vi.mocked(loginValidator.validate).mockImplementation(() => {
        throw new UnauthorizedException('Invalid credentials')
      })

      // Act & Assert
      await expect(useCase.invoke({ email: 'test@example.com', password: 'password123' })).rejects.toThrow(
        UnauthorizedException,
      )
    })

    it('should return the user profile and roles if the email and password are correct', async () => {
      // Arrange
      vi.mocked(authRepository.findAccountWithCredentialsByEmail).mockResolvedValue({
        id: 'user-1',
        emailAddress: 'test@example.com',
        passwordHash: 'correct-hash',
        passwordSalt: 'salt',
        role: 'role-1',
      })
      vi.mocked(loginValidator.validate).mockImplementation(() => {
        return
      })
      vi.mocked(getUserProfileUseCase.invoke).mockResolvedValue({
        userId: 'user-1',
        displayName: 'Test User',
      })
      vi.mocked(authService.generateTokenPair).mockResolvedValue({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      })

      // Act
      const result = await useCase.invoke({ email: 'test@example.com', password: 'password123' })

      // Assert
      expect(result).toEqual({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        email: 'test@example.com',
        displayName: 'Test User',
        role: 'role-1',
      })
    })
  })
})
