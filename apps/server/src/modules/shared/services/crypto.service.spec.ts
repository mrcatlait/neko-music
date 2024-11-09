import { describe, it, expect, beforeEach, vi } from 'vitest'
import bcrypt from 'bcrypt'

import { CryptoService } from './crypto.service'
import { ConfigService } from './config.service'

describe('CryptoService', () => {
  let cryptoService: CryptoService
  let configService: ConfigService

  const mockPepper = 'test-pepper'
  const mockSaltRounds = 10

  beforeEach(() => {
    configService = {
      get: vi.fn((key: string) => {
        if (key === 'PASSWORD_PEPPER') return mockPepper
        if (key === 'USER_PASSWORD_SALT_ROUNDS') return mockSaltRounds
        return undefined
      }),
    } as unknown as ConfigService

    cryptoService = new CryptoService(configService)
  })

  describe('generateHash', () => {
    it('should generate a hash from a password', async () => {
      // Arrange
      const password = 'testPassword123'
      const expectedPepperedPassword = `${password}${mockPepper}`

      // Act
      const hash = await cryptoService.generateHash(password)

      // Assert
      expect(hash).toBeDefined()
      expect(hash).not.toBe(password)
      expect(bcrypt.compareSync(expectedPepperedPassword, hash)).toBe(true)
      expect(configService.get).toHaveBeenCalledWith('PASSWORD_PEPPER')
      expect(configService.get).toHaveBeenCalledWith('USER_PASSWORD_SALT_ROUNDS')
    })

    it('should generate different hashes for the same password', async () => {
      // Arrange
      const password = 'testPassword123'

      // Act
      const hash1 = await cryptoService.generateHash(password)
      const hash2 = await cryptoService.generateHash(password)

      // Assert
      expect(hash1).not.toBe(hash2)
    })
  })

  describe('compareHash', () => {
    it('should return true for matching password and hash', async () => {
      // Arrange
      const password = 'testPassword123'
      const hash = await cryptoService.generateHash(password)

      // Act
      const result = cryptoService.compareHash(password, hash)

      // Assert
      expect(result).toBe(true)
      expect(configService.get).toHaveBeenCalledWith('PASSWORD_PEPPER')
    })

    it('should return false for non-matching password and hash', async () => {
      // Arrange
      const password = 'testPassword123'
      const wrongPassword = 'wrongPassword456'
      const hash = await cryptoService.generateHash(password)

      // Act
      const result = cryptoService.compareHash(wrongPassword, hash)

      // Assert
      expect(result).toBe(false)
      expect(configService.get).toHaveBeenCalledWith('PASSWORD_PEPPER')
    })
  })
})
