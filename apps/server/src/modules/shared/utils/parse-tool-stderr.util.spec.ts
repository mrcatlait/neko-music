import { parseToolStderr } from './parse-tool-stderr.util'

describe('parseToolStderr', () => {
  it('should extract the last ERROR line and strip youtube prefixes', () => {
    // Arrange
    const stderr = `WARNING: [youtube] No supported JavaScript runtime
ERROR: [youtube] mNltY3MnPrE: Private video. Sign in if you've been granted access to this video.`

    // Act
    const result = parseToolStderr(stderr)

    // Assert
    expect(result).toBe("Private video. Sign in if you've been granted access to this video.")
  })

  it('should return null when stderr has no ERROR lines', () => {
    // Arrange
    const stderr = 'WARNING: something went wrong'

    // Act
    const result = parseToolStderr(stderr)

    // Assert
    expect(result).toBeNull()
  })
})
