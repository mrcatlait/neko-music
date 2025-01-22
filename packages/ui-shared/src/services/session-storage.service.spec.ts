import { TestBed } from '@angular/core/testing'

import { SessionStorageService } from './session-storage.service'
import { Session } from '../models'

describe('SessionStorageService', () => {
  let service: SessionStorageService

  const mockSession: Session = {
    accessToken: 'accessToken',
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SessionStorageService],
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
      expect(service.get()).toEqual(mockSession)
    })
  })

  describe('get', () => {
    it('should return null when no session exists', () => {
      // Act
      const result = service.get()

      // Assert
      expect(result).toBeNull()
    })

    it('should return parsed session when it exists in storage', () => {
      // Arrange
      service.set(mockSession)

      // Act
      const result = service.get()

      // Assert
      expect(result).toEqual(mockSession)
    })
  })

  describe('remove', () => {
    it('should remove session from storage', () => {
      // Arrange
      service.set(mockSession)

      // Act
      service.remove()

      // Assert
      expect(service.get()).toBeNull()
    })
  })
})
