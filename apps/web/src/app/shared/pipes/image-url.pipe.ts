import { Pipe, PipeTransform } from '@angular/core'

import { ImageSize } from '@core/enum'
import { Image } from '@core/models'

type ImageSizeValues = `${ImageSize}`

export const resolutionMap = {
  [ImageSize.Small]: '56x56',
  [ImageSize.Medium]: '256x256',
  [ImageSize.Large]: '720x720',
}

@Pipe({
  name: 'imageUrl',
})
export class ImageUrlPipe implements PipeTransform {
  transform(images?: Image[], size: ImageSizeValues = ImageSize.Small): string {
    if (!images || images.length === 0) {
      return ''
    }

    return images.find((image) => image.resolution === resolutionMap[size])?.url ?? ''
  }
}
