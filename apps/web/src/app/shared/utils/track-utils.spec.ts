import { generateCompositeTrackId } from './track-utils'

import { Queue, Track } from '@core/interfaces'

describe('generateCompositeTrackId', () => {
  it('should generate a composite track ID when queue and track are valid', () => {
    // Arrange
    const queue = {
      source: { entityId: 'playlist123' },
    } as Queue
    const track = { id: 'track456' } as Track

    // Act
    const result = generateCompositeTrackId(queue, track)

    // Assert
    expect(result).toBe('playlist123:track456')
  })

  it('should return empty string when track is null', () => {
    // Arrange
    const queue = {
      source: { entityId: 'playlist123' },
    } as Queue

    // Act
    const result = generateCompositeTrackId(queue, null)

    // Assert
    expect(result).toBe('')
  })

  it('should return empty string when queue source entityId is falsy', () => {
    // Arrange
    const queue = {
      source: { entityId: '' },
    } as Queue
    const track = { id: 'track456' } as Track

    // Act
    const result = generateCompositeTrackId(queue, track)

    // Assert
    expect(result).toBe('')
  })
})
