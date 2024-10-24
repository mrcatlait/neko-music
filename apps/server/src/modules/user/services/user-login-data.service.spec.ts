import { Test } from '@nestjs/testing'
import { PartiallyMocked } from 'vitest'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { UserLoginDataService } from './user-login-data.service'
import { UserLoginDataEntity } from '../entities'

import { CryptoService } from '@modules/authentication/services'

describe('UserLoginDataService', () => {
  let userLoginDataService: UserLoginDataService
  let userLoginDataRepositoryMock: PartiallyMocked<Repository<UserLoginDataEntity>>
  let cryptoServiceMock: PartiallyMocked<CryptoService>

  beforeEach(async () => {
    userLoginDataRepositoryMock = {
      create: vi.fn(),
      findOne: vi.fn(),
    }

    cryptoServiceMock = {
      generateHash: vi.fn(),
    }

    const module = await Test.createTestingModule({
      providers: [
        UserLoginDataService,
        {
          provide: getRepositoryToken(UserLoginDataEntity),
          useValue: userLoginDataRepositoryMock,
        },
        {
          provide: CryptoService,
          useValue: cryptoServiceMock,
        },
      ],
    }).compile()

    userLoginDataService = module.get(UserLoginDataService)
  })

  describe('createUserLoginDataEntity', () => {
    it('should create a new UserLoginDataEntity', async () => {
      // Arrange
      const userId = '1'
      const email = 'test@example.com'
      const password = 'password123'
      const hashedPassword = 'hashedPassword123'
      const mockUserLoginData = new UserLoginDataEntity()
      Object.assign(mockUserLoginData, { userId, email, passwordHash: hashedPassword })

      cryptoServiceMock.generateHash?.mockResolvedValue(hashedPassword)
      userLoginDataRepositoryMock.create?.mockReturnValue(mockUserLoginData)

      // Act
      const result = await userLoginDataService.createUserLoginDataEntity(userId, email, password)

      // Assert
      expect(result).toBeDefined()
      expect(result.userId).toBe(userId)
      expect(result.email).toBe(email)
      expect(result.passwordHash).toBe(hashedPassword)
      expect(cryptoServiceMock.generateHash).toHaveBeenCalledWith(password)
      expect(userLoginDataRepositoryMock.create).toHaveBeenCalledWith({
        userId,
        email,
        passwordHash: hashedPassword,
      })
    })
  })

  describe('findByEmail', () => {
    it('should return a UserLoginDataEntity when found', async () => {
      // Arrange
      const email = 'test@example.com'
      const mockUserLoginData = new UserLoginDataEntity()
      Object.assign(mockUserLoginData, { email })
      userLoginDataRepositoryMock.findOne?.mockResolvedValue(mockUserLoginData)

      // Act
      const result = await userLoginDataService.findByEmail(email)

      // Assert
      expect(result).toBeDefined()
      expect(result?.email).toBe(email)
      expect(userLoginDataRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { email },
        relations: { userAccount: { role: { permissions: true } } },
      })
    })

    it('should return null when UserLoginDataEntity is not found', async () => {
      // Arrange
      const email = 'nonexistent@example.com'
      userLoginDataRepositoryMock.findOne?.mockResolvedValue(null)

      // Act
      const result = await userLoginDataService.findByEmail(email)

      // Assert
      expect(result).toBeNull()
      expect(userLoginDataRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { email },
        relations: { userAccount: { role: { permissions: true } } },
      })
    })
  })
})
