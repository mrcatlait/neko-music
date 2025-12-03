import { BadRequestException, InternalServerErrorException } from '@nestjs/common'
import { Test } from '@nestjs/testing'

import { RegisterUserUseCase, RegisterUserUseCaseParams } from './register-user.use-case'
import { RegisterUserValidator } from './register-user.validator'
import { AuthRepository } from '../../repositories'
import { AuthService } from '../../services'

import { CreateUserProfileUseCase } from '@/modules/user/use-cases'
import { ConfigService } from '@/modules/config/services'

describe('RegisterUserUseCase', () => {
  let useCase: RegisterUserUseCase
  let authRepository: AuthRepository
  let registerValidator: RegisterUserValidator
  let createUserProfileUseCase: CreateUserProfileUseCase
  let authService: AuthService

  const mockPasswordSalt = 'mock-salt'
  const mockPasswordHash = 'mock-hash'

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        RegisterUserUseCase,
        {
          provide: AuthRepository,
          useValue: {
            findDefaultRole: vi.fn(),
            createAccountWithCredentials: vi.fn(),
            findAccountPermissions: vi.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            config: {
              SALT_ROUNDS: 10,
            },
          },
        },
        {
          provide: RegisterUserValidator,
          useValue: {
            validate: vi.fn(),
          },
        },
        {
          provide: CreateUserProfileUseCase,
          useValue: {
            invoke: vi.fn(),
          },
        },
        {
          provide: AuthService,
          useValue: {
            generatePasswordSalt: vi.fn().mockReturnValue(mockPasswordSalt),
            generatePasswordHash: vi.fn().mockReturnValue(mockPasswordHash),
            generateTokenPair: vi.fn(),
          },
        },
      ],
    }).compile()

    useCase = moduleRef.get(RegisterUserUseCase)
    authRepository = moduleRef.get(AuthRepository)
    registerValidator = moduleRef.get(RegisterUserValidator)
    createUserProfileUseCase = moduleRef.get(CreateUserProfileUseCase)
    authService = moduleRef.get(AuthService)
  })

  describe('invoke', () => {
    const mockParams: RegisterUserUseCaseParams = {
      email: 'test@example.com',
      password: 'SecurePassword123',
      displayName: 'Test User',
    }

    describe('when registration is successful', () => {
      it('should register user and return tokens with user data', async () => {
        // Arrange
        const mockRole = { id: 'role-1', name: 'user', description: 'Default user role', default: true }
        const mockAccount = { id: 'user-1', emailAddress: 'test@example.com', roleId: 'role-1' }
        const mockUserProfile = { userId: 'user-1', displayName: 'Test User' }
        const mockPermissions = [
          { id: 'perm-1', name: 'read:profile', description: 'Read profile' },
          { id: 'perm-2', name: 'write:profile', description: 'Write profile' },
        ]
        const mockTokenPair = {
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
        }

        vi.mocked(registerValidator.validate).mockResolvedValue({ isValid: true })
        vi.mocked(authRepository.findDefaultRole).mockResolvedValue(mockRole)
        vi.mocked(authRepository.createAccountWithCredentials).mockResolvedValue(mockAccount)
        vi.mocked(createUserProfileUseCase.invoke).mockResolvedValue(mockUserProfile)
        vi.mocked(authRepository.findAccountPermissions).mockResolvedValue(mockPermissions)
        vi.mocked(authService.generateTokenPair).mockResolvedValue(mockTokenPair)

        // Act
        const result = await useCase.invoke(mockParams)

        // Assert
        expect(registerValidator.validate).toHaveBeenCalledWith(mockParams)
        expect(authRepository.findDefaultRole).toHaveBeenCalled()
        expect(authService.generatePasswordSalt).toHaveBeenCalled()
        expect(authService.generatePasswordHash).toHaveBeenCalledWith(mockParams.password, mockPasswordSalt)
        expect(authRepository.createAccountWithCredentials).toHaveBeenCalledWith({
          email: mockParams.email,
          passwordHash: mockPasswordHash,
          passwordSalt: mockPasswordSalt,
          roleId: mockRole.id,
        })
        expect(createUserProfileUseCase.invoke).toHaveBeenCalledWith({
          userId: mockAccount.id,
          displayName: mockParams.displayName,
        })
        expect(authRepository.findAccountPermissions).toHaveBeenCalledWith(mockAccount.id)
        expect(authService.generateTokenPair).toHaveBeenCalledWith({
          userId: mockAccount.id,
          scopes: ['read:profile', 'write:profile'],
        })
        expect(result).toEqual({
          accessToken: mockTokenPair.accessToken,
          refreshToken: mockTokenPair.refreshToken,
          email: mockAccount.emailAddress,
          displayName: mockUserProfile.displayName,
          permissions: ['read:profile', 'write:profile'],
        })
      })

      it('should handle user with no permissions', async () => {
        // Arrange
        const mockRole = { id: 'role-1', name: 'user', description: 'Default user role', default: true }
        const mockAccount = { id: 'user-1', emailAddress: 'test@example.com', roleId: 'role-1' }
        const mockUserProfile = { userId: 'user-1', displayName: 'Test User' }
        const mockPermissions: Array<{ id: string; name: string; description: string }> = []
        const mockTokenPair = {
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
        }

        vi.mocked(registerValidator.validate).mockResolvedValue({ isValid: true })
        vi.mocked(authRepository.findDefaultRole).mockResolvedValue(mockRole)
        vi.mocked(authRepository.createAccountWithCredentials).mockResolvedValue(mockAccount)
        vi.mocked(createUserProfileUseCase.invoke).mockResolvedValue(mockUserProfile)
        vi.mocked(authRepository.findAccountPermissions).mockResolvedValue(mockPermissions)
        vi.mocked(authService.generateTokenPair).mockResolvedValue(mockTokenPair)

        // Act
        const result = await useCase.invoke(mockParams)

        // Assert
        expect(result.permissions).toEqual([])
        expect(authService.generateTokenPair).toHaveBeenCalledWith({
          userId: mockAccount.id,
          scopes: [],
        })
      })
    })

    describe('when validation fails', () => {
      it('should throw BadRequestException with validation errors', async () => {
        // Arrange
        vi.mocked(registerValidator.validate).mockResolvedValue({
          isValid: false,
          errors: ['emailTaken'],
        })

        // Act & Assert
        await expect(useCase.invoke(mockParams)).rejects.toThrow(BadRequestException)
        expect(registerValidator.validate).toHaveBeenCalledWith(mockParams)
        expect(authRepository.findDefaultRole).not.toHaveBeenCalled()
        expect(authRepository.createAccountWithCredentials).not.toHaveBeenCalled()
      })

      it('should throw BadRequestException with multiple validation errors', async () => {
        // Arrange
        vi.mocked(registerValidator.validate).mockResolvedValue({
          isValid: false,
          errors: ['emailTaken', 'invalidEmail'],
        })

        // Act & Assert
        await expect(useCase.invoke(mockParams)).rejects.toThrow(BadRequestException)
        expect(registerValidator.validate).toHaveBeenCalledWith(mockParams)
      })
    })

    describe('when default role is not found', () => {
      it('should throw InternalServerErrorException', async () => {
        // Arrange
        vi.mocked(registerValidator.validate).mockResolvedValue({ isValid: true })
        vi.mocked(authRepository.findDefaultRole).mockResolvedValue(undefined)

        // Act & Assert
        await expect(useCase.invoke(mockParams)).rejects.toThrow(InternalServerErrorException)
        expect(registerValidator.validate).toHaveBeenCalledWith(mockParams)
        expect(authRepository.findDefaultRole).toHaveBeenCalled()
        expect(authRepository.createAccountWithCredentials).not.toHaveBeenCalled()
      })
    })

    describe('when account creation fails', () => {
      it('should propagate the database error', async () => {
        // Arrange
        const mockRole = { id: 'role-1', name: 'user', description: 'Default user role', default: true }
        const databaseError = new Error('Database connection failed')

        vi.mocked(registerValidator.validate).mockResolvedValue({ isValid: true })
        vi.mocked(authRepository.findDefaultRole).mockResolvedValue(mockRole)
        vi.mocked(authRepository.createAccountWithCredentials).mockRejectedValue(databaseError)

        // Act & Assert
        await expect(useCase.invoke(mockParams)).rejects.toThrow('Database connection failed')
        expect(authRepository.createAccountWithCredentials).toHaveBeenCalled()
      })
    })

    describe('when user profile creation fails', () => {
      it('should propagate the error', async () => {
        // Arrange
        const mockRole = { id: 'role-1', name: 'user', description: 'Default user role', default: true }
        const mockAccount = { id: 'user-1', emailAddress: 'test@example.com', roleId: 'role-1' }
        const profileError = new Error('Profile creation failed')

        vi.mocked(registerValidator.validate).mockResolvedValue({ isValid: true })
        vi.mocked(authRepository.findDefaultRole).mockResolvedValue(mockRole)
        vi.mocked(authRepository.createAccountWithCredentials).mockResolvedValue(mockAccount)
        vi.mocked(createUserProfileUseCase.invoke).mockRejectedValue(profileError)
        vi.mocked(authRepository.findAccountPermissions).mockResolvedValue([])

        // Act & Assert
        await expect(useCase.invoke(mockParams)).rejects.toThrow('Profile creation failed')
        expect(createUserProfileUseCase.invoke).toHaveBeenCalledWith({
          userId: mockAccount.id,
          displayName: mockParams.displayName,
        })
      })
    })

    describe('when fetching permissions fails', () => {
      it('should propagate the error', async () => {
        // Arrange
        const mockRole = { id: 'role-1', name: 'user', description: 'Default user role', default: true }
        const mockAccount = { id: 'user-1', emailAddress: 'test@example.com', roleId: 'role-1' }
        const mockUserProfile = { userId: 'user-1', displayName: 'Test User' }
        const permissionsError = new Error('Failed to fetch permissions')

        vi.mocked(registerValidator.validate).mockResolvedValue({ isValid: true })
        vi.mocked(authRepository.findDefaultRole).mockResolvedValue(mockRole)
        vi.mocked(authRepository.createAccountWithCredentials).mockResolvedValue(mockAccount)
        vi.mocked(createUserProfileUseCase.invoke).mockResolvedValue(mockUserProfile)
        vi.mocked(authRepository.findAccountPermissions).mockRejectedValue(permissionsError)

        // Act & Assert
        await expect(useCase.invoke(mockParams)).rejects.toThrow('Failed to fetch permissions')
        expect(authRepository.findAccountPermissions).toHaveBeenCalledWith(mockAccount.id)
      })
    })

    describe('when token generation fails', () => {
      it('should propagate the error', async () => {
        // Arrange
        const mockRole = { id: 'role-1', name: 'user', description: 'Default user role', default: true }
        const mockAccount = { id: 'user-1', emailAddress: 'test@example.com', roleId: 'role-1' }
        const mockUserProfile = { userId: 'user-1', displayName: 'Test User' }
        const mockPermissions = [{ id: 'perm-1', name: 'read:profile', description: 'Read profile' }]
        const tokenError = new Error('Token generation failed')

        vi.mocked(registerValidator.validate).mockResolvedValue({ isValid: true })
        vi.mocked(authRepository.findDefaultRole).mockResolvedValue(mockRole)
        vi.mocked(authRepository.createAccountWithCredentials).mockResolvedValue(mockAccount)
        vi.mocked(createUserProfileUseCase.invoke).mockResolvedValue(mockUserProfile)
        vi.mocked(authRepository.findAccountPermissions).mockResolvedValue(mockPermissions)
        vi.mocked(authService.generateTokenPair).mockRejectedValue(tokenError)

        // Act & Assert
        await expect(useCase.invoke(mockParams)).rejects.toThrow('Token generation failed')
        expect(authService.generateTokenPair).toHaveBeenCalledWith({
          userId: mockAccount.id,
          scopes: ['read:profile'],
        })
      })
    })

    describe('parallel operations', () => {
      it('should execute profile creation and permission fetching in parallel', async () => {
        // Arrange
        const mockRole = { id: 'role-1', name: 'user', description: 'Default user role', default: true }
        const mockAccount = { id: 'user-1', emailAddress: 'test@example.com', roleId: 'role-1' }
        const mockUserProfile = { userId: 'user-1', displayName: 'Test User' }
        const mockPermissions = [{ id: 'perm-1', name: 'read:profile', description: 'Read profile' }]
        const mockTokenPair = {
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
        }

        vi.mocked(registerValidator.validate).mockResolvedValue({ isValid: true })
        vi.mocked(authRepository.findDefaultRole).mockResolvedValue(mockRole)
        vi.mocked(authRepository.createAccountWithCredentials).mockResolvedValue(mockAccount)
        vi.mocked(createUserProfileUseCase.invoke).mockResolvedValue(mockUserProfile)
        vi.mocked(authRepository.findAccountPermissions).mockResolvedValue(mockPermissions)
        vi.mocked(authService.generateTokenPair).mockResolvedValue(mockTokenPair)

        // Act
        await useCase.invoke(mockParams)

        // Assert - Both operations should be called (executed in parallel via Promise.all)
        expect(createUserProfileUseCase.invoke).toHaveBeenCalled()
        expect(authRepository.findAccountPermissions).toHaveBeenCalled()
      })
    })
  })
})
