import { rmSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

import { FailedImportParsingException } from '../../exceptions'
import { YoutubeImportStrategy } from './youtube-import.strategy'

describe('YoutubeImportStrategy', () => {
  const downloadDirectory = join(tmpdir(), 'youtube-import')
  const strategy = new YoutubeImportStrategy({
    downloadDirectory,
  })

  describe('validateSourceRef', () => {
    it('should validate a valid youtube video url', () => {
      // Arrange
      const input = 'https://youtu.be/dQw4w9WgXcQ'

      // Act
      const result = strategy.validateSourceRef(input)

      // Assert
      expect(result).toBe(true)
    })

    it('should validate a valid youtube playlist url', () => {
      // Arrange
      const input = 'https://youtube.com/playlist?list=PLdLicNECcpk7d-8lJiTLIUmLxPLRiYULu'

      // Act
      const result = strategy.validateSourceRef(input)

      // Assert
      expect(result).toBe(true)
    })

    it('should fail to validate an invalid youtube url', () => {
      // Arrange
      const input = 'https://www.google.com'

      // Act
      const result = strategy.validateSourceRef(input)

      // Assert
      expect(result).toBe(false)
    })

    it('should fail to validate a youtube url that is not a video or playlist', () => {
      // Arrange
      const input = 'https://youtube.com/channel/UCdLicNECcpk7d-8lJiTLIUmLxPLRiYULu'

      // Act
      const result = strategy.validateSourceRef(input)

      // Assert
      expect(result).toBe(false)
    })

    it('should fail to validate a youtube url that references missing video', () => {
      // Arrange
      const input = 'https://youtube.com/watch?v=NotValid'

      // Act
      const result = strategy.validateSourceRef(input)

      // Assert
      expect(result).toBe(false)
    })
  })

  describe('discoverTracks', () => {
    it('should discover a valid youtube video url', () => {
      // Arrange
      const input = 'https://youtu.be/dQw4w9WgXcQ'

      // Act
      const result = strategy.discoverTracks(input)

      // Assert
      expect(result.tracks).toHaveLength(1)
      expect(result.tracks).toContainEqual(
        expect.objectContaining({ sourceItemRef: 'dQw4w9WgXcQ' }),
      )
    })

    it('should discover a valid youtube playlist url', () => {
      // Arrange
      const input = 'https://youtube.com/playlist?list=PLdLicNECcpk7d-8lJiTLIUmLxPLRiYULu'

      // Act
      const result = strategy.discoverTracks(input)

      // Assert
      expect(result.tracks.length).toBeGreaterThan(0)
      expect(result.tracks).toContainEqual(
        expect.objectContaining({ sourceItemRef: expect.any(String) }),
      )
    })

    it('should throw an error if the input is not a valid youtube url', () => {
      // Arrange
      const input = 'https://www.google.com'

      // Act & Assert
      expect(() => strategy.discoverTracks(input)).toThrow(FailedImportParsingException)
    })

    it('should throw an error if the input is a valid youtube url but references missing video', () => {
      // Arrange
      const input = 'https://youtube.com/watch?v=NotValid'

      // Act & Assert
      expect(() => strategy.discoverTracks(input)).toThrow(FailedImportParsingException)
    })
  })

  // describe('ingestTrack', () => {
  //   afterEach(() => {
  //     rmSync(downloadDirectory, { recursive: true })
  //   })

  //   it('should ingest a valid youtube video url', async () => {
  //     // Arrange
  //     const input = 'https://youtu.be/dQw4w9WgXcQ'

  //     // Act
  //     const result = await strategy.ingestTrack(input)

  //     // Assert
  //     expect(result.title).toBe('Rick Astley - Never Gonna Give You Up (Official Video) (4K Remaster)')
  //     expect(result.album).toEqual({
  //       confidence: MetadataConfidence.Low,
  //       externalRef: undefined,
  //       value: 'Rick Astley - Never Gonna Give You Up (Official Video) (4K Remaster)',
  //     })
  //     expect(result.artists).toHaveLength(1)
  //     expect(result.artists).toContainEqual({
  //       value: 'Rick Astley',
  //       confidence: MetadataConfidence.Low,
  //       externalRef: 'UCuAXFkgsw1L7xaCfnd5JJOw',
  //     })
  //     expect(result.genres.length).toBeGreaterThan(1)
  //     expect(result.genres).toContainEqual({ value: '80s music', confidence: MetadataConfidence.Medium })
  //     expect(result.sourceId).toBe('dQw4w9WgXcQ')
  //     expect(result.sourceUrl).toBe('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
  //     expect(result.assets.artworkPath).toContain(downloadDirectory)
  //     expect(result.assets.audioPath).toContain(downloadDirectory)
  //   })
  // })
})
