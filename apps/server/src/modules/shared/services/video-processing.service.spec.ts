import { Test } from '@nestjs/testing'
import { InternalServerErrorException } from '@nestjs/common'
import { join } from 'path'
import { File } from '@nest-lab/fastify-multer'

import { VideoProcessingService } from './video-processing.service'

import { MEDIA_PATH, STREAM_PATH } from '@common/constants'

const fluentFfmpegMock = vi.hoisted(() => {
  const eventMap: Record<string, () => void> = {}

  return {
    default: vi.fn().mockReturnThis(),
    outputOptions: vi.fn().mockReturnThis(),
    output: vi.fn().mockReturnThis(),
    on: vi.fn().mockImplementation((event, callback: (...params: any[]) => void) => {
      if (event === 'error') {
        eventMap.error = () => callback(new InternalServerErrorException())
      } else if (event === 'end') {
        eventMap.end = callback
      }
      return fluentFfmpegMock
    }),
    run: vi.fn(),
    emit: (event: string) => eventMap[event](),
  }
})
vi.mock('fluent-ffmpeg', () => fluentFfmpegMock)

const fsMock = vi.hoisted(() => {
  return {
    existsSync: vi.fn().mockReturnThis(),
    mkdirSync: vi.fn().mockReturnThis(),
    readFileSync: vi.fn().mockReturnThis(),
    writeFileSync: vi.fn().mockReturnThis(),
  }
})
vi.mock('fs', () => fsMock)

describe('VideoProcessingService', () => {
  let service: VideoProcessingService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [VideoProcessingService],
    }).compile()

    service = module.get(VideoProcessingService)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('generateDashStream', () => {
    const videoBuffer = Buffer.from('sample video data')
    const options = {
      video: {
        buffer: videoBuffer,
        mimetype: 'video/mp4',
      } as File,
      folderPath: 'sample-folder',
    }

    it('should generate a DASH stream', async () => {
      // Arrange
      const sourcePath = join(MEDIA_PATH, options.folderPath, 'original')
      const targetPath = join(STREAM_PATH, options.folderPath)
      const videoPath = join(sourcePath, 'video.mp4')
      const manifestPath = targetPath + '/manifest.mpd'

      fsMock.existsSync.mockReturnValueOnce(false)
      fsMock.existsSync.mockReturnValueOnce(false)
      fsMock.existsSync.mockReturnValueOnce(true)
      fsMock.mkdirSync.mockImplementationOnce(() => {})
      fsMock.mkdirSync.mockImplementationOnce(() => {})
      fsMock.writeFileSync.mockImplementationOnce(() => {})

      fluentFfmpegMock.run.mockImplementation(() => {
        fluentFfmpegMock.emit('end')
      })

      // Act
      await expect(service.generateDashStream(options)).resolves.toBeUndefined()

      // Assert
      expect(fsMock.existsSync).toHaveBeenCalledWith(sourcePath)
      expect(fsMock.existsSync).toHaveBeenCalledWith(targetPath)
      expect(fsMock.mkdirSync).toHaveBeenCalledWith(sourcePath, { recursive: true })
      expect(fsMock.mkdirSync).toHaveBeenCalledWith(targetPath, { recursive: true })
      expect(fsMock.writeFileSync).toHaveBeenCalledWith(videoPath, videoBuffer)
      expect(fluentFfmpegMock.default).toHaveBeenCalledWith(videoPath)
      expect(fluentFfmpegMock.outputOptions).toHaveBeenCalledWith([
        '-f dash',
        '-init_seg_name init_$RepresentationID$.m4s',
        '-media_seg_name chunk_$RepresentationID$_$Number%05d$.m4s',
        '-map 0:v:0',
        '-c:v:0 libx264',
        '-b:v:0 500k',
        '-s:v:0 1280x720',
        '-map 0:a:0',
        '-c:a:0 aac',
        '-b:a:0 256k',
      ])
      expect(fluentFfmpegMock.output).toHaveBeenCalledWith(manifestPath)
      expect(fluentFfmpegMock.run).toHaveBeenCalled()
    })

    it('should throw an InternalServerErrorException if video buffer is missing', async () => {
      // Arrange
      const invalidOptions = { ...options, video: { buffer: undefined } as File }

      fluentFfmpegMock.run.mockImplementation(() => {
        fluentFfmpegMock.emit('error')
      })

      // Act & Assert
      await expect(service.generateDashStream(invalidOptions)).rejects.toThrow(InternalServerErrorException)
    })

    it('should throw an InternalServerErrorException if an error occurs during transcoding', async () => {
      // Arrange
      fsMock.existsSync.mockReturnValueOnce(false)
      fsMock.existsSync.mockReturnValueOnce(false)
      fsMock.existsSync.mockReturnValueOnce(true)
      fsMock.mkdirSync.mockImplementationOnce(() => {})
      fsMock.mkdirSync.mockImplementationOnce(() => {})
      fsMock.writeFileSync.mockImplementationOnce(() => {})

      fluentFfmpegMock.run.mockImplementation(() => {
        fluentFfmpegMock.emit('error')
      })

      // Act & Assert
      await expect(service.generateDashStream(options)).rejects.toThrow(InternalServerErrorException)
    })
  })

  describe('getDashStreamDuration', () => {
    const options = {
      folderPath: 'sample-folder',
    }

    it('should return the duration of the DASH stream', () => {
      // Arrange
      const manifestPath = join(STREAM_PATH, options.folderPath, 'manifest.mpd')
      const manifestData = `
        <MPD xmlns="urn:mpeg:dash:schema:mpd:2011" mediaPresentationDuration="PT1H30M">
          <Period>
            <AdaptationSet>
              <Representation></Representation>
            </AdaptationSet>
          </Period>
        </MPD>
      `

      fsMock.readFileSync.mockReturnValueOnce(manifestData)

      // Act
      const duration = service.getDashStreamDuration(options)

      // Assert
      expect(fsMock.readFileSync).toHaveBeenCalledWith(manifestPath, 'utf8')
      expect(duration).toBe(1 * 60 * 60 + 30 * 60)
    })

    it('should throw an InternalServerErrorException if the manifest does not contain the duration', () => {
      // Arrange
      const manifestPath = join(STREAM_PATH, options.folderPath, 'manifest.mpd')
      const manifestData = `
        <MPD xmlns="urn:mpeg:dash:schema:mpd:2011">
          <Period>
            <AdaptationSet>
              <Representation></Representation>
            </AdaptationSet>
          </Period>
        </MPD>
      `

      fsMock.readFileSync.mockReturnValueOnce(manifestData)

      // Act & Assert
      expect(() => service.getDashStreamDuration(options)).toThrow(InternalServerErrorException)
      expect(fsMock.readFileSync).toHaveBeenCalledWith(manifestPath, 'utf8')
    })
  })
})
