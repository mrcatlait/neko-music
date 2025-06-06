export interface Artwork {
  /**
   * The URL pointing to the artwork. Preceded by `{size}` in the filename as placeholder for image size.
   */
  url: string
  /**
   * The average background color of the artwork.
   */
  backgroundColor: string
  /**
   * The text color used if the {@link backgroundColor} is used as a background.
   */
  textColor: string
}
