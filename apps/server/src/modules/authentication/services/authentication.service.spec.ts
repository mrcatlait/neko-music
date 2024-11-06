import { Test } from '@nestjs/testing'
import { PartiallyMocked } from 'vitest'

import { AuthenticationService } from './authentication.service'
import { UserLoginDto } from '../dto'

import { UserAccountService, UserLoginDataService } from '@modules/user/services'
import { UserAccountEntity, UserLoginDataEntity } from '@modules/user/entities'
import { CryptoService } from '@shared/services'

describe('AuthenticationService', () => {
  let authenticationService: AuthenticationService
  let userLoginDataServiceMock: PartiallyMocked<UserLoginDataService>
  let userAccountServiceMock: PartiallyMocked<UserAccountService>
  let cryptoServiceMock: PartiallyMocked<CryptoService>

  beforeEach(async () => {
    userLoginDataServiceMock = {
      findByEmail: vi.fn(),
    }

    userAccountServiceMock = {
      createUserAccount: vi.fn(),
    }

    cryptoServiceMock = {
      compareHash: vi.fn(),
    }

    const module = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        {
          provide: UserAccountService,
          useValue: userAccountServiceMock,
        },
        {
          provide: UserLoginDataService,
          useValue: userLoginDataServiceMock,
        },
        {
          provide: CryptoService,
          useValue: cryptoServiceMock,
        },
      ],
    }).compile()

    authenticationService = module.get(AuthenticationService)
  })

  describe('validateUser', () => {
    it('should return user account when credentials are valid', async () => {
      // Arrange
      const mockUserLoginDto: UserLoginDto = {
        email: 'test@example.com',
        password: 'password123',
      }
      const mockUserAccount = new UserAccountEntity()
      mockUserAccount.id = '1'
      const mockUserLoginData = {
        userAccount: mockUserAccount,
        passwordHash: 'hashedPassword',
      } as UserLoginDataEntity

      userLoginDataServiceMock.findByEmail?.mockResolvedValue(mockUserLoginData)
      cryptoServiceMock.compareHash?.mockReturnValue(true)

      // Act
      const result = await authenticationService.validateUser(mockUserLoginDto)

      // Assert
      expect(result).toBeDefined()
      expect(result).toBe(mockUserAccount)
      expect(userLoginDataServiceMock.findByEmail).toHaveBeenCalledWith(mockUserLoginDto.email)
      expect(cryptoServiceMock.compareHash).toHaveBeenCalledWith(
        mockUserLoginDto.password,
        mockUserLoginData.passwordHash,
      )
    })

    it('should return null when user is not found', async () => {
      // Arrange
      const mockUserLoginDto: UserLoginDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      }
      userLoginDataServiceMock.findByEmail?.mockResolvedValue(null)

      // Act
      const result = await authenticationService.validateUser(mockUserLoginDto)

      // Assert
      expect(result).toBeNull()
      expect(userLoginDataServiceMock.findByEmail).toHaveBeenCalledWith(mockUserLoginDto.email)
      expect(cryptoServiceMock.compareHash).not.toHaveBeenCalled()
    })

    it('should return null when password is incorrect', async () => {
      // Arrange
      const mockUserLoginDto: UserLoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      }
      const mockUserLoginData = {
        userAccount: new UserAccountEntity(),
        passwordHash: 'hashedPassword',
      } as UserLoginDataEntity

      userLoginDataServiceMock.findByEmail?.mockResolvedValue(mockUserLoginData)
      cryptoServiceMock.compareHash?.mockReturnValue(false)

      // Act
      const result = await authenticationService.validateUser(mockUserLoginDto)

      // Assert
      expect(result).toBeNull()
      expect(userLoginDataServiceMock.findByEmail).toHaveBeenCalledWith(mockUserLoginDto.email)
      expect(cryptoServiceMock.compareHash).toHaveBeenCalledWith(
        mockUserLoginDto.password,
        mockUserLoginData.passwordHash,
      )
    })

    it('should return null when an error occurs', async () => {
      // Arrange
      const mockUserLoginDto: UserLoginDto = {
        email: 'test@example.com',
        password: 'password123',
      }
      userLoginDataServiceMock.findByEmail?.mockRejectedValue(new Error('Database error'))

      // Act
      const result = await authenticationService.validateUser(mockUserLoginDto)

      // Assert
      expect(result).toBeNull()
      expect(userLoginDataServiceMock.findByEmail).toHaveBeenCalledWith(mockUserLoginDto.email)
    })
  })
})
