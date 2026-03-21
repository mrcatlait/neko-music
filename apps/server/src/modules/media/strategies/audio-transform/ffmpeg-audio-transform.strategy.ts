import { execSync } from 'child_process'
import { readdirSync } from 'node:fs'
import { ModuleRef } from '@nestjs/core'
import { Logger } from '@nestjs/common'

import { AudioTransformParameters, AudioTransformResult, AudioTransformStrategy } from './audio-transform.strategy'
import { NamingStrategy } from '../naming/naming.strategy'
import { MEDIA_MODULE_OPTIONS } from '../../tokens'
import { MediaModuleOptions } from '../../types'

import { InjectableStrategy } from '@/modules/shared/types'

/**
 * Audio transform strategy that uses ffmpeg to transform audio files to MPEG-DASH format.
 */
export class FfmpegAudioTransformStrategy implements AudioTransformStrategy, InjectableStrategy {
  private readonly logger = new Logger(this.constructor.name)

  private namingStrategy: NamingStrategy

  onInit(moduleRef: ModuleRef): void {
    this.namingStrategy = moduleRef.get<MediaModuleOptions>(MEDIA_MODULE_OPTIONS).namingStrategy
  }

  async transform(
    audioFilePath: string,
    targetDirectory: string,
    parameters: AudioTransformParameters,
  ): Promise<AudioTransformResult> {
    const manifestName = this.namingStrategy.generateDashManifestName()
    // https://stackoverflow.com/questions/40046444/how-should-i-use-the-dash-not-webm-dash-manifest-format-in-ffmpeg
    const manifestPath = `${targetDirectory}/${manifestName}`

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
      audioFilePath,
      // DASH options
      '-f dash',
      `-init_seg_name ${this.namingStrategy.generateDashInitSegmentName({ segmentNumber: '$RepresentationID$' })}`,
      `-media_seg_name ${this.namingStrategy.generateDashMediaSegmentName({ segmentNumber: '$RepresentationID$', chunkNumber: '$Number%05d$' })}`,
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

      const files = readdirSync(targetDirectory)

      const segments = files.filter((fileName) => fileName !== manifestName)

      return Promise.resolve({
        manifestName,
        segments,
      })
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }
}
