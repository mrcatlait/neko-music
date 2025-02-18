export enum ImageSize {
  SMALL = 'small', // 56x56
  MEDIUM = 'medium', // 256x256
  LARGE = 'large', // 720x720
}

export type ImageDto = {
  url: string
  resolution: string
}
