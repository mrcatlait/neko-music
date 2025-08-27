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
   * Name of the generated DASH manifest file
   * @example 'manifest.mpd'
   */
  readonly manifestName: string
  /**
   * Names of all generated DASH segment files
   * @example ['init_0.m4s', 'chunk_0_00001.m4s']
   */
  readonly segmentNames: string[]
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
   * @param audio - The buffer of the source file
   * @param targetDirectory - The directory to store the transformed files
   * @param parameters - The parameters for the audio transformation
   * @returns The result of the audio transformation
   */
  transform(audio: Buffer, targetDirectory: string, parameters: AudioTransformParameters): Promise<AudioTransformResult>
}
