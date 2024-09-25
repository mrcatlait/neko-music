import { Pipe, PipeTransform } from '@angular/core'

import { ImageSize } from '@core/enum'
import { Image } from '@core/models'

type ImageSizeValues = `${ImageSize}`

export const resolutionMap = {
  [ImageSize.SMALL]: '56x56',
  [ImageSize.MEDIUM]: '256x256',
  [ImageSize.LARGE]: '720x720',
}

@Pipe({
  name: 'imageUrl',
})
export class ImageUrlPipe implements PipeTransform {
  transform(images?: Image[], size: ImageSizeValues = ImageSize.SMALL): string | undefined {
    if (!images || images.length === 0) {
      return
    }

    return images.find((image) => image.resolution === resolutionMap[size])?.url
  }
}
