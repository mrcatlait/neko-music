import { ImageUrlPipe } from './image-url.pipe'

import { ImageSize } from '../enums'
import { Image } from '../interfaces'

describe('ImageUrlPipe', () => {
  let pipe: ImageUrlPipe

  beforeEach(() => {
    pipe = new ImageUrlPipe()
  })

  it('should return empty string for empty or undefined input', () => {
    // Act & Assert
    expect(pipe.transform(undefined)).toBe('')
    expect(pipe.transform([])).toBe('')
  })

  it('should return the correct URL for the default size (SMALL)', () => {
    // Arrange
    const images: Image[] = [
      { resolution: '56x56', url: 'small-image.jpg' },
      { resolution: '256x256', url: 'medium-image.jpg' },
      { resolution: '720x720', url: 'large-image.jpg' },
    ]

    // Act
    const result = pipe.transform(images)

    // Assert
    expect(result).toBe('small-image.jpg')
  })

  it('should return the correct URL for the specified size', () => {
    // Arrange
    const images: Image[] = [
      { resolution: '56x56', url: 'small-image.jpg' },
      { resolution: '256x256', url: 'medium-image.jpg' },
      { resolution: '720x720', url: 'large-image.jpg' },
    ]

    // Act & Assert
    expect(pipe.transform(images, ImageSize.Medium)).toBe('medium-image.jpg')
    expect(pipe.transform(images, ImageSize.Large)).toBe('large-image.jpg')
  })

  it('should return empty string if the requested size is not available', () => {
    // Arrange
    const images: Image[] = [{ resolution: '56x56', url: 'small-image.jpg' }]

    // Act
    const result = pipe.transform(images, ImageSize.Large)

    // Assert
    expect(result).toBe('')
  })
})
