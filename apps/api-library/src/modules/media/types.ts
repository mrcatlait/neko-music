import { AudioTransformParameters, AudioTransformStrategy } from './strategies/audio-transform'
import { ImageAnalyzeStrategy } from './strategies/image-analyze'
import { ImageTransformParameters, ImageTransformStrategy } from './strategies/image-transform'
import { NamingStrategy } from './strategies/naming'
import { StorageStrategy } from './strategies/storage'

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
}
