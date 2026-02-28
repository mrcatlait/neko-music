/**
 * Artwork format aligned with Apple Music API, using preset names for sizes.
 * @see https://developer.apple.com/documentation/applemusicapi/artwork
 */
export interface Artwork {
  /** Template URL with {size} placeholder; use preset names (small, medium, large) */
  url: string
  /** Available preset names matching image transform presets */
  sizes: string[]
  /** Background color as hex (e.g. "000000") */
  bgColor: string
  /** Primary text color for contrast (hex) */
  textColor1?: string
  textColor2?: string
  textColor3?: string
  textColor4?: string
}
