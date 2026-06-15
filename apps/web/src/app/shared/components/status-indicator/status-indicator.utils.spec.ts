import { formatStatusIndicatorCount, normalizeStatus, resolveStatusIndicator } from './status-indicator.utils'

describe('status-indicator.utils', () => {
  describe('normalizeStatus', () => {
    it('should normalize uppercase and snake_case values', () => {
      // Arrange
      const status = 'IN_PROGRESS'

      // Act
      const result = normalizeStatus(status)

      // Assert
      expect(result).toBe('in-progress')
    })
  })

  describe('resolveStatusIndicator', () => {
    it('should resolve known presets', () => {
      // Arrange
      const status = 'PUBLISHED'

      // Act
      const result = resolveStatusIndicator({ status })

      // Assert
      expect(result).toEqual({
        tone: 'success',
        icon: 'check_circle',
        label: 'Published',
        shape: 'circle',
      })
    })

    it('should use explicit tone when provided', () => {
      // Arrange
      const status = 'failed'

      // Act
      const result = resolveStatusIndicator({ status, tone: 'warning' })

      // Assert
      expect(result.tone).toBe('warning')
      expect(result.icon).toBe('error')
      expect(result.label).toBe('Failed')
    })

    it('should humanize unknown status values', () => {
      // Arrange
      const status = 'needs_manual_review'

      // Act
      const result = resolveStatusIndicator({ status })

      // Assert
      expect(result.tone).toBe('info')
      expect(result.icon).toBe('info')
      expect(result.label).toBe('Needs Manual Review')
    })
  })

  describe('formatStatusIndicatorCount', () => {
    it('should clamp big values to 999+', () => {
      // Arrange
      const count = 1420

      // Act
      const result = formatStatusIndicatorCount(count)

      // Assert
      expect(result).toBe('999+')
    })

    it('should return empty string for invalid values', () => {
      // Arrange
      const count = 0

      // Act
      const result = formatStatusIndicatorCount(count)

      // Assert
      expect(result).toBe('')
    })
  })
})
