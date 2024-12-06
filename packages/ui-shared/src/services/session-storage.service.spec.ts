import { TestBed } from '@angular/core/testing'
import { PartiallyMocked } from 'vitest'

import { SessionStorageService } from './session-storage.service'
import { Session } from '../models'
import { WINDOW } from '../tokens'

describe('SessionStorageService', () => {
  let service: SessionStorageService
  let sessionStorageMock: PartiallyMocked<Storage>

  const mockSession: Session = {
    accessToken: 'accessToken',
  }

  beforeEach(() => {
    sessionStorageMock = {
      setItem: vi.fn(),
      getItem: vi.fn(),
      removeItem: vi.fn(),
    }

    TestBed.configureTestingModule({
      providers: [SessionStorageService, { provide: WINDOW, useValue: { sessionStorage: sessionStorageMock } }],
    })
    service = TestBed.inject(SessionStorageService)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('set', () => {
    it('should store session in sessionStorage', () => {
      // Act
      service.set(mockSession)

      // Assert
      expect(sessionStorageMock.setItem).toHaveBeenCalledWith('neko.session', JSON.stringify(mockSession))
    })
  })

  describe('get', () => {
    it('should return null when no session exists', () => {
      // Arrange
      sessionStorageMock.getItem?.mockReturnValue(null)

      // Act
      const result = service.get()

      // Assert
      expect(result).toBeNull()
    })

    it('should return parsed session when it exists in storage', () => {
      // Arrange
      sessionStorageMock.getItem?.mockReturnValue(JSON.stringify(mockSession))

      // Act
      const result = service.get()

      // Assert
      expect(sessionStorageMock.getItem).toHaveBeenCalledWith('neko.session')
      expect(result).toEqual(mockSession)
    })

    it('should handle JSON parsing of stored session', () => {
      // Arrange
      vi.spyOn(JSON, 'parse')
      sessionStorageMock.getItem?.mockReturnValue(JSON.stringify(mockSession))

      // Act
      const result = service.get()

      // Assert
      expect(JSON.parse).toHaveBeenCalled()
      expect(result).toEqual(mockSession)
    })
  })

  describe('remove', () => {
    it('should remove session from storage', () => {
      // Act
      service.remove()

      // Assert
      expect(sessionStorageMock.removeItem).toHaveBeenCalledWith('neko.session')
    })
  })
})
