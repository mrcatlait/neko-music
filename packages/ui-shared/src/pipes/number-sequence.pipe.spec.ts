import { NumberSequencePipe } from './number-sequence.pipe'

describe('NumberSequencePipe', () => {
  let pipe: NumberSequencePipe

  beforeEach(() => {
    pipe = new NumberSequencePipe()
  })

  it('should return an empty array for input 0', () => {
    // Act & Assert
    expect(pipe.transform(0)).toEqual([])
  })

  it('should return [0] for input 1', () => {
    // Act & Assert
    expect(pipe.transform(1)).toEqual([0])
  })

  it('should return [0, 1, 2] for input 3', () => {
    // Act & Assert
    expect(pipe.transform(3)).toEqual([0, 1, 2])
  })

  it('should return correct sequence for larger numbers', () => {
    // Act
    const result = pipe.transform(10)

    // Assert
    expect(result).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
    expect(result.length).toBe(10)
  })

  it('should handle negative numbers by returning an empty array', () => {
    // Act & Assert
    expect(pipe.transform(-5)).toEqual([])
  })
})
