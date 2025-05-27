import { EMPTY, Observable, of, throwError } from 'rxjs'

import { EntityState } from './entity.state'

import { FetchStatus } from '@core/enums'

class TestState extends EntityState<unknown, string> {
  fetchFn = vi.fn((_payload: string): Observable<unknown> => EMPTY)
}

describe('EntityState', () => {
  let state: TestState

  beforeEach(() => {
    state = new TestState()
  })

  describe('state', () => {
    it('should have correct initial state', () => {
      // Assert
      expect(state.data()).toBeNull()
      expect(state.status()).toBe(FetchStatus.Pending)
      expect(state.error()).toBeNull()
      expect(state.loading()).toBe(false)
    })
  })

  describe('fetch', () => {
    it('should set status to Loading and call fetchFn when fetch is called', () => {
      // Arrange
      const payload = 'test-payload'

      // Act
      state.fetch(payload)

      // Assert
      expect(state.status()).toBe(FetchStatus.Loading)
      expect(state.fetchFn).toHaveBeenCalledWith(payload)
    })

    it('should update loading computed property when status changes', () => {
      // Act & Assert
      expect(state.loading()).toBe(false)

      // Act
      state.fetch('test')

      // Assert
      expect(state.loading()).toBe(true)
    })

    it('should set data and status to Success when fetch is successful', () => {
      // Arrange
      const responseData = { id: 1, name: 'Entity' }
      state.fetchFn.mockReturnValue(of(responseData))

      // Act
      state.fetch('test')

      // Assert
      expect(state.data()).toEqual(responseData)
      expect(state.status()).toBe(FetchStatus.Success)
      expect(state.loading()).toBe(false)
      expect(state.error()).toBeNull()
    })

    it('should set error and status to Error when fetch encounters an error', () => {
      // Arrange
      const error = new Error('Fetch error')
      state.fetchFn.mockReturnValue(throwError(() => error))

      // Act
      state.fetch('test')

      // Assert
      expect(state.error()).toBe(error.message)
      expect(state.status()).toBe(FetchStatus.Error)
      expect(state.loading()).toBe(false)
      expect(state.data()).toBeNull()
    })

    it('should handle empty response correctly', () => {
      // Arrange
      state.fetchFn.mockReturnValue(of(null))

      // Act
      state.fetch('test')

      // Assert
      expect(state.data()).toBeNull()
      expect(state.status()).toBe(FetchStatus.Success)
      expect(state.loading()).toBe(false)
      expect(state.error()).toBeNull()
    })

    it('should handle multiple fetch calls correctly', () => {
      // Arrange
      const firstResponse = { id: 1, name: 'First' }
      const secondResponse = { id: 2, name: 'Second' }
      state.fetchFn.mockReturnValueOnce(of(firstResponse)).mockReturnValueOnce(of(secondResponse))

      // Act & Assert (first fetch)
      state.fetch('first')
      expect(state.data()).toEqual(firstResponse)

      // Act & Assert (second fetch)
      state.fetch('second')
      expect(state.data()).toEqual(secondResponse)
    })

    it('should use cached data when cache is true and data is available', () => {
      // Arrange
      const cachedData = { id: 1, name: 'Cached Entity' }
      state.data.set(cachedData)
      state['cache'] = true
      const fetchSpy = vi.spyOn(state, 'fetchFn')

      // Act
      state.fetch('test')

      // Assert
      expect(state.data()).toEqual(cachedData)
      expect(state.status()).toBe(FetchStatus.Success)
      expect(state.loading()).toBe(false)
      expect(state.error()).toBeNull()
      expect(fetchSpy).not.toHaveBeenCalled()
    })

    it('should fetch new data when cache is true but no data is available', () => {
      // Arrange
      const responseData = { id: 2, name: 'New Entity' }
      state.fetchFn.mockReturnValue(of(responseData))

      // Act
      state.fetch('test')

      // Assert
      expect(state.data()).toEqual(responseData)
      expect(state.status()).toBe(FetchStatus.Success)
      expect(state.loading()).toBe(false)
      expect(state.error()).toBeNull()
      expect(state.fetchFn).toHaveBeenCalledWith('test')
    })
  })
})
