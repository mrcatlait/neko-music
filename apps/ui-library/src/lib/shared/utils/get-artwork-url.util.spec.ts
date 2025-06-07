import { describe, it, expect } from 'vitest'
import { getArtworkUrl } from './get-artwork-url.util'

describe('getArtworkUrl', () => {
  describe('when template contains size placeholder', () => {
    it('should replace {size} with provided size', () => {
      // Arrange
      const template = 'https://cdn.example.com/image/{size}'
      const size = 'medium'

      // Act
      const result = getArtworkUrl(template, size)

      // Assert
      expect(result).toBe('https://cdn.example.com/image/medium')
    })

    it('should handle all supported sizes', () => {
      // Arrange
      const template = 'https://cdn.example.com/artwork/{size}.jpg'

      // Act & Assert
      expect(getArtworkUrl(template, 'small')).toBe('https://cdn.example.com/artwork/small.jpg')
      expect(getArtworkUrl(template, 'medium')).toBe('https://cdn.example.com/artwork/medium.jpg')
      expect(getArtworkUrl(template, 'large')).toBe('https://cdn.example.com/artwork/large.jpg')
    })

    it('should handle case-sensitive placeholder', () => {
      // Arrange
      const template = 'https://cdn.example.com/{SIZE}'
      const size = 'medium'

      // Act
      const result = getArtworkUrl(template, size)

      // Assert
      expect(result).toBe('https://cdn.example.com/{SIZE}') // Should not replace {SIZE}
    })
  })

  describe('when template has no size placeholder', () => {
    it('should return original template unchanged', () => {
      // Arrange
      const template = 'https://cdn.example.com/default-artwork.jpg'
      const size = 'medium'

      // Act
      const result = getArtworkUrl(template, size)

      // Assert
      expect(result).toBe(template)
    })
  })

  describe('when template is empty or invalid', () => {
    it('should handle empty template', () => {
      // Arrange
      const template = ''
      const size = 'medium'

      // Act
      const result = getArtworkUrl(template, size)

      // Assert
      expect(result).toBe('')
    })

    it('should handle template with only placeholder', () => {
      // Arrange
      const template = '{size}'
      const size = 'small'

      // Act
      const result = getArtworkUrl(template, size)

      // Assert
      expect(result).toBe('small')
    })
  })
})
