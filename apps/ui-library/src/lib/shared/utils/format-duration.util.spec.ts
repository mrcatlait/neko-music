import { describe, it, expect } from 'vitest'
import { formatDuration } from './format-duration.util'

describe('formatDuration', () => {
  it('should format duration in seconds to a string in the format of HH:MM:SS', () => {
    expect(formatDuration(3661)).toBe('1:01:01')
  })

  it('should format duration in seconds to a string in the format of MM:SS', () => {
    expect(formatDuration(60)).toBe('1:00')
  })

  it('should format duration in seconds to a string in the format of SS', () => {
    expect(formatDuration(10)).toBe('0:10')
  })

  it('should return "0:00" for invalid duration', () => {
    expect(formatDuration(-10)).toBe('0:00')
  })

  it('should return "0:00" for duration of 0', () => {
    expect(formatDuration(0)).toBe('0:00')
  })

  it('should return "0:00" for duration of 0.5', () => {
    expect(formatDuration(0.5)).toBe('0:00')
  })
})
