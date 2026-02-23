import { execSync } from 'child_process'
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'fs'
import { ModuleRef } from '@nestjs/core'
import { join } from 'path'
import { Logger } from '@nestjs/common'

import { AudioTransformParameters, AudioTransformResult, AudioTransformStrategy } from './audio-transform.strategy'
import { NamingStrategy } from '../naming/naming.strategy'
import { MEDIA_MODULE_OPTIONS } from '../../tokens'
import { MediaModuleOptions } from '../../types'
import { FileService } from '../../services'

import { InjectableStrategy } from '@/modules/shared/interfaces'

/**
 * Audio transform strategy that uses ffmpeg to transform audio files to MPEG-DASH format.
 */
export class FfmpegAudioTransformStrategy implements AudioTransformStrategy, InjectableStrategy {
  private readonly logger = new Logger(this.constructor.name)

  private namingStrategy: NamingStrategy
  private fileService: FileService

  onInit(moduleRef: ModuleRef): void {
    this.namingStrategy = moduleRef.get<MediaModuleOptions>(MEDIA_MODULE_OPTIONS).namingStrategy
    this.fileService = moduleRef.get(FileService)
  }

  async transform(
    audio: Buffer,
    targetDirectory: string,
    parameters: AudioTransformParameters,
  ): Promise<AudioTransformResult> {
    const manifestName = this.namingStrategy.generateDashManifestName()
    // https://stackoverflow.com/questions/40046444/how-should-i-use-the-dash-not-webm-dash-manifest-format-in-ffmpeg
    const manifestPath = `${targetDirectory}/${manifestName}`

    const format = await this.fileService.getFileTypeFromBuffer(audio)

    if (!format) {
      throw new Error('Failed to get file type from buffer')
    }

    const sourceFilePath = join(targetDirectory, `${crypto.randomUUID()}.${format}`)

    if (!existsSync(targetDirectory)) {
      mkdirSync(targetDirectory, { recursive: true })
    }

    writeFileSync(sourceFilePath, audio)

    const bitrateArgs = parameters.bitrate.map((b, index) =>
      [
        '-map 0:a:0',
        `-b:a:${index} ${b}`,
        `-c:a:${index} ${parameters.codec}`,
        `-ar:${index} ${parameters.sampleRate}`,
        `-ac:${index} ${parameters.channels}`,
      ].join(' '),
    )

    const args = [
      // Input file
      '-i',
      sourceFilePath,
      // DASH options
      '-f dash',
      `-init_seg_name ${this.namingStrategy.generateDashInitSegmentName('$RepresentationID$')}`,
      `-media_seg_name ${this.namingStrategy.generateDashMediaSegmentName('$RepresentationID$', '$Number%05d$')}`,
      `-seg_duration ${parameters.segmentDuration}`,
      '-vn', // No video
      // Audio options
      ...bitrateArgs,
      `-adaptation_sets "id=0,streams=${bitrateArgs.map((_, index) => index).join(',')}"`,
      // Output file
      manifestPath,
    ]

    const command = `ffmpeg ${args.join(' ')}`

    try {
      execSync(command, {
        stdio: 'ignore',
      })

      rmSync(sourceFilePath)

      const files = readdirSync(targetDirectory)

      const segmentNames = files.filter((fileName) => fileName !== manifestName)
      const totalSize = this.fileService.getDirectorySize(targetDirectory)

      return Promise.resolve({
        manifestName,
        segmentNames,
        metadata: {
          totalSize,
        },
      })
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }
}
