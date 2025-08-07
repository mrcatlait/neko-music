import { AudioTransformStrategy } from './strategies/audio-transform'
import { ImageAnalyzeStrategy } from './strategies/image-analyze'
import { ImageTransformStrategy } from './strategies/image-transform'
import { StorageStrategy } from './strategies/storage'

export interface MediaModuleOptions {
  storageStrategy: StorageStrategy
  imageTransformStrategy: ImageTransformStrategy
  imageAnalyzeStrategy: ImageAnalyzeStrategy
  audioTransformStrategy: AudioTransformStrategy
}
