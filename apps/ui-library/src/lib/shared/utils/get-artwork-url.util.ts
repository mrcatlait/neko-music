type ImageSize = 'small' | 'medium' | 'large'

/**
 * Get the artwork url for a given template and size
 * @param template - The template to use. Example: https://i.scdn.co/image/{size}
 * @param size - The size of the artwork. Example: `small`, `medium`, `large`
 * @returns The artwork url
 */
export const getArtworkUrl = (template: string, size: ImageSize) => {
  return template.replace('{size}', size)
}
