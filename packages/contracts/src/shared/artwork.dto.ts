export interface ArtworkDto {
  /**
   * The template URL with {size} placeholder; use preset names: small, medium, large
   * @example 'https://example.com/artwork/{size}.webp'
   */
  url: string
  /**
   * The dominant color of the artwork
   * @example #000000
   */
  dominantColor: string
}
