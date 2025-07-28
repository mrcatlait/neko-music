import { ArtworkSize } from '../enums'
import { ImageResolution } from '../models'

export const ARTWORK_RESOLUTIONS: Record<ArtworkSize, ImageResolution> = {
  [ArtworkSize.SMALL]: { width: 56, height: 56 },
  [ArtworkSize.MEDIUM]: { width: 256, height: 256 },
  [ArtworkSize.LARGE]: { width: 720, height: 720 },
  [ArtworkSize.ORIGINAL]: { width: 0, height: 0 },
}
