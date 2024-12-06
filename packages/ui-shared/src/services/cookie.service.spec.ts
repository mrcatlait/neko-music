import { TestBed } from '@angular/core/testing'
import { DOCUMENT } from '@angular/common'

import { CookieService } from './cookie.service'

describe('CookieService', () => {
  let cookieService: CookieService
  let documentMock: Partial<Document>

  beforeEach(() => {
    documentMock = {
      cookie: '',
    }

    TestBed.configureTestingModule({
      providers: [CookieService, { provide: DOCUMENT, useValue: documentMock }],
    })

    cookieService = TestBed.inject(CookieService)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('get', () => {
    it('should get a cookie', () => {
      // Arrange
      documentMock.cookie = 'neko.testCookie=testValue'

      // Act
      const result = cookieService.get('testCookie')

      // Assert
      expect(result).toBe('testValue')
    })

    it('should return undefined for non-existent cookie', () => {
      // Arrange
      documentMock.cookie = ''

      // Act
      const result = cookieService.get('nonExistentCookie')

      // Assert
      expect(result).toBe('')
    })

    it('should safely decode URI component', () => {
      // Arrange
      documentMock.cookie = 'neko.testCookie=%E0%A4%A'

      // Act
      const result = cookieService.get('testCookie')

      // Assert
      expect(result).toBe('%E0%A4%A')
    })
  })

  describe('set', () => {
    it('should set a cookie', () => {
      // Arrange
      const cookieOptions = { name: 'testCookie', value: 'testValue' }

      // Act
      cookieService.set(cookieOptions)

      // Assert
      expect(documentMock.cookie).toContain('neko.testCookie=testValue')
    })

    it('should set a cookie with expiration date', () => {
      // Arrange
      const cookieOptions = { name: 'testCookie', value: 'testValue', expires: 1 }

      // Act
      cookieService.set(cookieOptions)

      // Assert
      expect(documentMock.cookie).toContain('neko.testCookie=testValue')
      expect(documentMock.cookie).toContain('Expires=')
    })

    it('should set a secure cookie', () => {
      // Arrange
      const cookieOptions = { name: 'testCookie', value: 'testValue', secure: true }

      // Act
      cookieService.set(cookieOptions)

      // Assert
      expect(documentMock.cookie).toContain('neko.testCookie=testValue')
      expect(documentMock.cookie).toContain('Secure')
    })

    it('should handle URL-encoded characters in cookie names and values', () => {
      // Arrange
      const cookieOptions = { name: 'test Cookie', value: 'test Value' }

      // Act
      cookieService.set(cookieOptions)

      // Assert
      expect(documentMock.cookie).toContain('neko.test%20Cookie=test%20Value')
    })
  })

  describe('delete', () => {
    it('should delete a cookie', () => {
      // Arrange
      documentMock.cookie = 'neko.testCookie=testValue'

      // Act
      cookieService.delete('testCookie')

      // Assert
      expect(documentMock.cookie).toContain('neko.testCookie=')
      expect(documentMock.cookie).toContain('Expires=Thu, 01 Jan 1970 00:00:01 GMT')
    })
  })
})
