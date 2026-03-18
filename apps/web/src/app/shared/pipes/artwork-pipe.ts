import { inject, Pipe, PipeTransform } from '@angular/core'

import { ARTWORK_LOADER_TOKEN } from '@/core/providers'

type ArtworkSize = 'small' | 'medium' | 'large'

/**
 * Get the artwork URL for a given template and size.
 * Applies MEDIA_BASE_URL for relative paths (e.g. from API).
 *
 * @param template - The template with {size} placeholder; can be relative or absolute
 * @param size - The size of the artwork. Example: `small`, `medium`, `large`
 * @returns The full artwork URL
 *
 * @example
 * ```html
 * {{ 'track_artwork_{size}.webp' | artwork: 'large' }} // Returns: 'https://api.neko-music.com/media/track_artwork_large.webp'
 * ```
 */
@Pipe({
  name: 'artwork',
})
export class ArtworkPipe implements PipeTransform {
  private readonly artworkLoader = inject(ARTWORK_LOADER_TOKEN)

  transform(template?: string, size: ArtworkSize = 'medium'): string {
    if (!template) {
      return ''
    }

    if (!template?.trim()) {
      return ''
    }

    return this.artworkLoader(template.replace('{size}', size))
  }
}
