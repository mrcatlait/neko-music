import { describe, it, expect, beforeEach } from 'vitest'
import bcrypt from 'bcrypt'

import { CryptoService } from './crypto.service'

describe('CryptoService', () => {
  let cryptoService: CryptoService

  beforeEach(() => {
    cryptoService = new CryptoService()
  })

  describe('generateHash', () => {
    it('should generate a hash from a password', async () => {
      // Arrange
      const password = 'testPassword123'

      // Act
      const hash = await cryptoService.generateHash(password)

      // Assert
      expect(hash).toBeDefined()
      expect(hash).not.toBe(password)
      expect(bcrypt.compareSync(password, hash)).toBe(true)
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
    })
  })
})
