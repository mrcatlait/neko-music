import { Injectable, Logger } from '@nestjs/common'
import { exec } from 'child_process'
import { promisify } from 'util'

interface TranscodeDashOptions {
  sourcePath: string
  targetPath: string
}

interface ExecResult {
  stdout: string
  stderr: string
}

const execAsync = promisify(exec)

@Injectable()
export class AudioProcessingService {
  private readonly logger = new Logger(this.constructor.name)

  transcodeDash(options: TranscodeDashOptions): Promise<void> {
    this.logger.debug('Started DASH transcoding')

    // https://stackoverflow.com/questions/40046444/how-should-i-use-the-dash-not-webm-dash-manifest-format-in-ffmpeg
    const manifestPath = options.targetPath + '/manifest.mpd'

    return this.runFfmpegCommand([
      // Input file
      '-i',
      options.sourcePath,
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
      // Output file
      manifestPath,
    ])
      .catch((error) => {
        this.logger.error('Error during DASH transcoding', error)
        throw error
      })
      .then(() => {
        this.logger.debug('Completed DASH transcoding')
      })
  }

  private runFfmpegCommand(args: string[]): Promise<ExecResult> {
    const command = `ffmpeg ${args.join(' ')}`
    return execAsync(command)
  }
}
