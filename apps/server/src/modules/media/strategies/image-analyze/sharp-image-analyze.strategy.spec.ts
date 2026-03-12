import sharp from 'sharp'

import { SharpImageAnalyzeStrategy } from './sharp-image-analyze.strategy'

vi.mock('sharp')

describe('SharpImageAnalyzeStrategy', () => {
  let strategy: SharpImageAnalyzeStrategy

  beforeEach(() => {
    strategy = new SharpImageAnalyzeStrategy()
    vi.clearAllMocks()
  })

  describe('getDominantColor', () => {
    it('should return a correctly formatted 6-digit hex color', async () => {
      // Arrange
      const mockStats = { dominant: { r: 255, g: 128, b: 0 } }
      const mockSharpInstance = { stats: vi.fn().mockResolvedValue(mockStats) }
      vi.mocked(sharp).mockReturnValue(mockSharpInstance as unknown as sharp.Sharp)

      // Act
      const result = await strategy.getDominantColor(Buffer.from(''))

      // Assert
      expect(result).toBe('#ff8000')
    })

    it('should zero-pad single-digit hex channel values', async () => {
      // Arrange
      const mockStats = { dominant: { r: 15, g: 0, b: 10 } }
      const mockSharpInstance = { stats: vi.fn().mockResolvedValue(mockStats) }
      vi.mocked(sharp).mockReturnValue(mockSharpInstance as unknown as sharp.Sharp)

      // Act
      const result = await strategy.getDominantColor(Buffer.from(''))

      // Assert
      expect(result).toBe('#0f000a')
    })

    it('should return black (#000000) when all channels are zero', async () => {
      // Arrange
      const mockStats = { dominant: { r: 0, g: 0, b: 0 } }
      const mockSharpInstance = { stats: vi.fn().mockResolvedValue(mockStats) }
      vi.mocked(sharp).mockReturnValue(mockSharpInstance as unknown as sharp.Sharp)

      // Act
      const result = await strategy.getDominantColor(Buffer.from(''))

      // Assert
      expect(result).toBe('#000000')
    })

    it('should return white (#ffffff) when all channels are 255', async () => {
      // Arrange
      const mockStats = { dominant: { r: 255, g: 255, b: 255 } }
      const mockSharpInstance = { stats: vi.fn().mockResolvedValue(mockStats) }
      vi.mocked(sharp).mockReturnValue(mockSharpInstance as unknown as sharp.Sharp)

      // Act
      const result = await strategy.getDominantColor(Buffer.from(''))

      // Assert
      expect(result).toBe('#ffffff')
    })
  })
})
