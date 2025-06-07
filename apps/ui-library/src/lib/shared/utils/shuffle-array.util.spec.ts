import { shuffleArray } from './shuffle-array.util'

describe('shuffleArray', () => {
  // Store original Math.random to restore after tests
  const originalMathRandom = Math.random

  afterEach(() => {
    // Restore original Math.random after each test
    Math.random = originalMathRandom
  })

  it('should return an array with the same length', () => {
    // Arrange
    const inputArray = [1, 2, 3, 4, 5]

    // Act
    const result = shuffleArray(inputArray)

    // Assert
    expect(result).toHaveLength(inputArray.length)
  })

  it('should return an array with the same elements', () => {
    // Arrange
    const inputArray = [1, 2, 3, 4, 5]

    // Act
    const result = shuffleArray(inputArray)

    // Assert
    expect(result.sort()).toEqual(inputArray.sort())
  })

  it('should not modify the original array', () => {
    // Arrange
    const inputArray = [1, 2, 3, 4, 5]
    const originalArrayCopy = [...inputArray]

    // Act
    shuffleArray(inputArray)

    // Assert
    expect(inputArray).toEqual(originalArrayCopy)
  })

  it('should return a different array instance', () => {
    // Arrange
    const inputArray = [1, 2, 3, 4, 5]

    // Act
    const result = shuffleArray(inputArray)

    // Assert
    expect(result).not.toBe(inputArray)
  })

  it('should handle empty array', () => {
    // Arrange
    const inputArray: number[] = []

    // Act
    const result = shuffleArray(inputArray)

    // Assert
    expect(result).toEqual([])
    expect(result).toHaveLength(0)
  })

  it('should handle single element array', () => {
    // Arrange
    const inputArray = [42]

    // Act
    const result = shuffleArray(inputArray)

    // Assert
    expect(result).toEqual([42])
    expect(result).toHaveLength(1)
    expect(result).not.toBe(inputArray)
  })

  it('should produce different results across multiple calls', () => {
    // Arrange
    const inputArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const results = new Set<string>()

    // Act - Run shuffle multiple times
    for (let i = 0; i < 20; i++) {
      const result = shuffleArray(inputArray)
      results.add(JSON.stringify(result))
    }

    // Assert - Should have multiple different results due to randomness
    expect(results.size).toBeGreaterThan(1)
  })
})
