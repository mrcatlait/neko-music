import { InjectableStrategy } from '@/modules/shared/interfaces'

export type Bitrate = '64k' | '128k' | '256k'

export type Channels = 1 | 2 | 6 | 8

export type SampleRate = 8000 | 11025 | 12000 | 16000 | 22050 | 24000 | 32000 | 44100 | 48000 | 96000 | 192000

export type Codec = 'aac' | 'mp3' | 'opus' | 'vorbis' | 'pcm'

export interface AudioTransformParameters {
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

export interface AudioTransformResult {
  /**
   * Path to the generated DASH manifest file
   * @example '/tmp/audio-processing/abc123/manifest.mpd'
   */
  readonly manifestPath: string
  /**
   * Paths to all generated DASH segment files
   * @example ['/tmp/audio-processing/abc123/init_0.m4s', '/tmp/audio-processing/abc123/chunk_0_00001.m4s']
   */
  readonly segmentPaths: string[]
  /**
   * Metadata about the generated files
   */
  readonly metadata: {
    /**
     * Total size of all generated files in bytes
     */
    readonly totalSize: number
  }
}

/**
 * Audio transform strategy interface defines the methods that a audio MPEG-DASH transform strategy must implement
 */
export interface AudioTransformStrategy extends InjectableStrategy {
  /**
   * Transforms an audio file to MPEG-DASH format. Result is stored in local file system to reduce memory usage.
   * @param audio - The audio file to transform
   * @param targetPath - The path to the target file
   * @param parameters - The parameters for the audio transformation
   * @returns The result of the audio transformation
   */
  transform(audio: Buffer, targetPath: string, parameters: AudioTransformParameters): Promise<AudioTransformResult>
}
