import { TestBed } from '@angular/core/testing'
import { DOCUMENT } from '@angular/common'
import { provideZonelessChangeDetection } from '@angular/core'

import { Cookie } from './cookie'

describe('Cookie', () => {
  let cookie: Cookie
  let documentMock: Partial<Document>

  beforeEach(() => {
    documentMock = {
      cookie: '',
    }

    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), Cookie, { provide: DOCUMENT, useValue: documentMock }],
    })

    cookie = TestBed.inject(Cookie)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('get', () => {
    it('should get a cookie', () => {
      // Arrange
      documentMock.cookie = 'n.testCookie=testValue'

      // Act
      const result = cookie.get('testCookie')

      // Assert
      expect(result).toBe('testValue')
    })

    it('should return undefined for non-existent cookie', () => {
      // Arrange
      documentMock.cookie = ''

      // Act
      const result = cookie.get('nonExistentCookie')

      // Assert
      expect(result).toBe('')
    })

    it('should safely decode URI component', () => {
      // Arrange
      documentMock.cookie = 'n.testCookie=%E0%A4%A'

      // Act
      const result = cookie.get('testCookie')

      // Assert
      expect(result).toBe('%E0%A4%A')
    })
  })

  describe('set', () => {
    it('should set a cookie', () => {
      // Arrange
      const cookieOptions = { name: 'testCookie', value: 'testValue' }

      // Act
      cookie.set(cookieOptions)

      // Assert
      expect(documentMock.cookie).toContain('n.testCookie=testValue')
    })

    it('should set a cookie with expiration date', () => {
      // Arrange
      const cookieOptions = { name: 'testCookie', value: 'testValue', expires: 1 }

      // Act
      cookie.set(cookieOptions)

      // Assert
      expect(documentMock.cookie).toContain('n.testCookie=testValue')
      expect(documentMock.cookie).toContain('Expires=')
    })

    it('should set a secure cookie', () => {
      // Arrange
      const cookieOptions = { name: 'testCookie', value: 'testValue', secure: true }

      // Act
      cookie.set(cookieOptions)

      // Assert
      expect(documentMock.cookie).toContain('n.testCookie=testValue')
      expect(documentMock.cookie).toContain('Secure')
    })

    it('should handle URL-encoded characters in cookie names and values', () => {
      // Arrange
      const cookieOptions = { name: 'test Cookie', value: 'test Value' }

      // Act
      cookie.set(cookieOptions)

      // Assert
      expect(documentMock.cookie).toContain('n.test%20Cookie=test%20Value')
    })
  })

  describe('delete', () => {
    it('should delete a cookie', () => {
      // Arrange
      documentMock.cookie = 'n.testCookie=testValue'

      // Act
      cookie.delete('testCookie')

      // Assert
      expect(documentMock.cookie).toContain('n.testCookie=')
      expect(documentMock.cookie).toContain('Expires=Thu, 01 Jan 1970 00:00:01 GMT')
    })
  })
})
