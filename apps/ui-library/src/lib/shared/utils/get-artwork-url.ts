type ImageSize = 'small' | 'medium' | 'large'

export const getArtworkUrl = (template: string, size: ImageSize) => {
  return template.replace('{size}', size)
}
