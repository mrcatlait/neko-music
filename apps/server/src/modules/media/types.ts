import {
  AudioTransformParameters,
  AudioTransformStrategy,
  ImageAnalyzeStrategy,
  ImageTransformPresets,
  ImageTransformStrategy,
  NamingStrategy,
  StorageStrategy,
} from './strategies'

export interface MediaModuleOptions {
  storageStrategy: StorageStrategy
  imageTransformStrategy: ImageTransformStrategy
  imageTransformPresets: ImageTransformPresets
  imageAnalyzeStrategy: ImageAnalyzeStrategy
  audioTransformStrategy: AudioTransformStrategy
  audioTransformPreset: AudioTransformParameters
  namingStrategy: NamingStrategy
  /**
   * The directory where the media will be stored during processing.
   * This directory will be cleaned up after the media is processed.
   */
  temporaryDirectory: string
  /**
   * The allowed image mime types.
   * @example ['image/jpeg', 'image/png', 'image/webp']
   */
  allowedImageMimeTypes: string[]
  /**
   * The maximum size of the image in bytes.
   * @example 10485760 // (10MB)
   */
  maxImageSize: number
  /**
   * The expiration time for the upload token.
   * @example '15m'
   */
  /**
   * The allowed audio mime types.
   * @example ['audio/mpeg', 'audio/mp4', 'audio/ogg']
   */
  allowedAudioMimeTypes: string[]
  /**
   * The maximum size of the audio in bytes.
   * @example 10485760 // (10MB)
   */
  maxAudioSize: number
  /**
   * The expiration time for the upload token.
   * @example '15m'
   */
  uploadTokenExpiresIn: string
  /**
   * The maximum number of processing jobs that can run concurrently. This value might impact the memory usage of the application.
   * @example 10
   */
  maxConcurrentProcessingJobs: number
}
