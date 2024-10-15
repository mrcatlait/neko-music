import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { join } from 'path'
import ffmpeg from 'fluent-ffmpeg'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { File } from '@nest-lab/fastify-multer'

import { MEDIA_PATH, STREAM_PATH } from '@common/constants'

interface DashStreamOptions {
  video: File
  folderPath: string
}

interface DashStreamDurationOptions {
  folderPath: string
}

const mimetypeMap = {
  'video/quicktime': 'mov',
  'video/mp4': 'mp4',
}

@Injectable()
export class VideoProcessingService {
  private readonly logger = new Logger(VideoProcessingService.name)

  async generateDashStream(options: DashStreamOptions): Promise<void> {
    const data = options.video.buffer

    if (!data) {
      throw new InternalServerErrorException()
    }

    const sourcePath = join(MEDIA_PATH, options.folderPath, 'original')
    const targetPath = join(STREAM_PATH, options.folderPath)

    if (!existsSync(sourcePath)) {
      mkdirSync(sourcePath, { recursive: true })
    }

    const videoPath = join(sourcePath, `video.${mimetypeMap[options.video.mimetype]}`)
    writeFileSync(videoPath, data)

    if (!existsSync(targetPath)) {
      mkdirSync(targetPath, { recursive: true })
    }

    // https://stackoverflow.com/questions/40046444/how-should-i-use-the-dash-not-webm-dash-manifest-format-in-ffmpeg
    const manifestPath = targetPath + '/manifest.mpd'

    return new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .outputOptions([
          // DASH options
          '-f dash',
          '-init_seg_name init_$RepresentationID$.m4s',
          '-media_seg_name chunk_$RepresentationID$_$Number%05d$.m4s',
          // Video options
          '-map 0:v:0',
          '-c:v:0 libx264',
          '-b:v:0 500k',
          '-s:v:0 1280x720',
          // Audio options
          '-map 0:a:0',
          '-c:a:0 aac',
          '-b:a:0 256k',
        ])
        .output(manifestPath)
        .on('start', () => {
          this.logger.debug('Started DASH transcoding')
        })
        .on('error', (error: Error) => {
          this.logger.debug('Error during DASH transcoding')
          reject(error)
        })
        .on('end', () => {
          this.logger.debug('Completed DASH transcoding')
          resolve()
        })
        .run()
    })
  }

  getDashStreamDuration(options: DashStreamDurationOptions): number {
    const filePath = join(STREAM_PATH, options.folderPath, 'manifest.mpd')
    const data = readFileSync(filePath, 'utf8')
    const match = data.match(/(mediaPresentationDuration=")(.+)"/)

    if (!match) {
      throw new InternalServerErrorException()
    }

    const duration = this.parseISO8601Duration(match[2])

    const hours = duration.hours ? Number(duration.hours) * 60 * 60 : 0
    const minutes = duration.minutes ? Number(duration.minutes) * 60 : 0
    const seconds = duration.seconds ? Math.floor(Number(duration.seconds)) : 0

    return hours + minutes + seconds
  }

  // @todo: move to utils
  private parseISO8601Duration(iso8601Duration: string) {
    const iso8601DurationRegex =
      /(-)?P(?:([.,\d]+)Y)?(?:([.,\d]+)M)?(?:([.,\d]+)W)?(?:([.,\d]+)D)?T(?:([.,\d]+)H)?(?:([.,\d]+)M)?(?:([.,\d]+)S)?/

    const matches = iso8601DurationRegex.exec(iso8601Duration)

    if (!matches) {
      throw new InternalServerErrorException()
    }

    return {
      years: matches[2],
      months: matches[3],
      weeks: matches[4],
      days: matches[5],
      hours: matches[6],
      minutes: matches[7],
      seconds: matches[8],
    }
  }
}
