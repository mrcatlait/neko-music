import {
  AudioTransformParameters,
  AudioTransformStrategy,
  ImageAnalyzeStrategy,
  ImageTransformParameters,
  ImageTransformStrategy,
  NamingStrategy,
  StorageStrategy,
} from './strategies'

export interface MediaModuleOptions {
  storageStrategy: StorageStrategy
  imageTransformStrategy: ImageTransformStrategy
  imageTransformPresets: ImageTransformParameters[]
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
}
