import { Pipe, PipeTransform } from '@angular/core'

type ArtworkSize = 'small' | 'medium' | 'large'

/**
 * Get the artwork URL for a given template and size
 * @param template - The template to use.
 * @param size - The size of the artwork. Example: `small`, `medium`, `large`
 * @returns The artwork URL with all {size} placeholders replaced
 * @example
 * ```typescript
 * {{ 'https://cdn.example.com/artwork_{size}.webp' | artwork: 'large' }} // Returns: 'https://cdn.example.com/artwork_large.webp'
 * {{ 'https://cdn.example.com/artwork_{size}.webp' | artwork: 'medium' }} // Returns: 'https://cdn.example.com/artwork_medium.webp'
 * ```
 */
@Pipe({
  name: 'artwork',
})
export class ArtworkPipe implements PipeTransform {
  transform(template: string, size: ArtworkSize): string {
    return template.replace('{size}', size)
  }
}
