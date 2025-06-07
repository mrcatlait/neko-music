type ImageSize = 'small' | 'medium' | 'large'

/**
 * Get the artwork URL for a given template and size
 * @param template - The template to use.
 * @param size - The size of the artwork. Example: `small`, `medium`, `large`
 * @returns The artwork URL with all {size} placeholders replaced
 *
 * @example
 * ```typescript
 * getArtworkUrl('https://cdn.example.com/artwork_{size}.webp', 'large')
 * // Returns: 'https://cdn.example.com/artwork_large.webp'
 * ```
 */
export const getArtworkUrl = (template: string, size: ImageSize): string => {
  return template.replace('{size}', size)
}
