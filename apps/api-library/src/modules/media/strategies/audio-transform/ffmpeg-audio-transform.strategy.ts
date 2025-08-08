import { execSync } from 'child_process'
import { readdirSync, rmSync, writeFileSync } from 'fs'
import { ModuleRef } from '@nestjs/core'
import { join } from 'path'

import { AudioTransformParameters, AudioTransformResult, AudioTransformStrategy } from './audio-transform.strategy'
import { NamingStrategy } from '../naming/naming.strategy'
import { MEDIA_MODULE_OPTIONS } from '../../tokens'
import { MediaModuleOptions } from '../../types'
import { FileUtilsService } from '../../services'

import { InjectableStrategy } from '@/modules/app/interfaces'

export class FfmpegAudioTransformStrategy implements AudioTransformStrategy, InjectableStrategy {
  private namingStrategy: NamingStrategy
  private fileUtilsService: FileUtilsService

  onInit(moduleRef: ModuleRef): void {
    this.namingStrategy = moduleRef.get<MediaModuleOptions>(MEDIA_MODULE_OPTIONS).namingStrategy
    this.fileUtilsService = moduleRef.get(FileUtilsService)
  }

  async transform(
    audio: Buffer,
    targetPath: string,
    parameters: AudioTransformParameters,
  ): Promise<AudioTransformResult> {
    const manifestName = this.namingStrategy.generateDashManifestName()
    // https://stackoverflow.com/questions/40046444/how-should-i-use-the-dash-not-webm-dash-manifest-format-in-ffmpeg
    const manifestPath = `${targetPath}/${manifestName}`

    const format = await this.fileUtilsService.getFileTypeFromBuffer(audio)

    if (!format) {
      throw new Error('Failed to get file type from buffer')
    }

    const sourceFilePath = join(targetPath, `${crypto.randomUUID()}.${format}`)
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

      const files = readdirSync(targetPath)

      const segmentPaths = files.filter((fileName) => fileName !== manifestName)
      const totalSize = this.fileUtilsService.getDirectorySize(targetPath)

      return {
        manifestPath,
        segmentPaths,
        metadata: {
          totalSize,
        },
      }
    } catch (error) {
      this.fileUtilsService.deleteDirectory(targetPath)
      throw error
    }
  }
}
