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
   * Flag to indicate whether to cleanup the source file after processing.
   * Enable this flag to reduce the storage usage.
   */
  cleanupSourceAfterProcessing?: boolean
}
