import { exec } from 'child_process'
import { promisify } from 'util'
import { unlink, writeFile } from 'fs'
import { join } from 'path'

import { AudioTransformOptions, AudioTransformStrategy } from './audio-transform.strategy'
import { Bitrate, Channels, Codec, SampleRate } from './types'

const execAsync = promisify(exec)
const writeFileAsync = promisify(writeFile)
const unlinkAsync = promisify(unlink)

interface FfmpegAudioTransformStrategyOptions {
  /**
   * Bitrate of the audio stream (in kbps)
   * @example ['256k']
   */
  readonly bitrate: Bitrate[]
  /**
   * Number of channels in the audio stream
   * @example 2
   */
  readonly channels: Channels
  /**
   * Sample rate of the audio stream (in Hz)
   * @example 44100
   */
  readonly sampleRate: SampleRate
  /**
   * Codec of the audio stream
   * @example 'aac'
   */
  readonly codec: Codec
  /**
   * Segment duration of the audio stream (in seconds)
   * @example 10
   */
  readonly segmentDuration: number
}

export class FfmpegAudioTransformStrategy implements AudioTransformStrategy {
  constructor(private readonly options: FfmpegAudioTransformStrategyOptions) {}

  async transform(options: AudioTransformOptions): Promise<void> {
    // https://stackoverflow.com/questions/40046444/how-should-i-use-the-dash-not-webm-dash-manifest-format-in-ffmpeg
    const manifestPath = options.targetPath + '/manifest.mpd'

    const randomId = crypto.randomUUID()
    const tempPath = join(options.targetPath, `${randomId}.${options.sourceFormat}`)

    await writeFileAsync(tempPath, options.sourceBuffer)

    const bitrateArgs = this.options.bitrate.map((b, index) =>
      [
        '-map 0:a:0',
        `-b:a:${index} ${b}`,
        `-c:a:${index} ${this.options.codec}`,
        `-ar:${index} ${this.options.sampleRate}`,
        `-ac:${index} ${this.options.channels}`,
      ].join(' '),
    )

    const args = [
      // Input file
      '-i',
      tempPath,
      // DASH options
      '-f dash',
      '-init_seg_name init_$RepresentationID$.m4s',
      '-media_seg_name chunk_$RepresentationID$_$Number%05d$.m4s',
      `-seg_duration ${this.options.segmentDuration}`,
      '-vn', // No video
      // Audio options
      ...bitrateArgs,
      `-adaptation_sets "id=0,streams=${bitrateArgs.map((_, index) => index).join(',')}"`,
      // Output file
      manifestPath,
    ]

    const command = `ffmpeg ${args.join(' ')}`

    try {
      await execAsync(command)
    } finally {
      await unlinkAsync(tempPath)
    }
  }
}
