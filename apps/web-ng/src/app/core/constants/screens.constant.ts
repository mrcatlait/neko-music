export const Screens = {
  /**
   * Phone in portrait
   */
  Compact: '(max-width: 599.98px)',
  /**
   * Tablet in portrait
   * Foldable in portrait (unfolded)
   */
  Medium: '(min-width: 600px) and (max-width: 839.98px)',
  /**
   * Phone in landscape
   * Tablet in landscape
   * Foldable in landscape (unfolded)
   * Desktop
   */
  Expanded: '(min-width: 840px) and (max-width: 1199.98px)',
  /**
   * Desktop
   */
  Large: '(min-width: 1200px) and (max-width: 1599.98px)',
  /**
   * Desktop
   * Ultra-wide
   */
  XLarge: '(min-width: 1600px)',
} as const
