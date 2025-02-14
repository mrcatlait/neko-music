import { WindowClass } from '../enums'

export const Breakpoints: Record<WindowClass, string> = {
  [WindowClass.Compact]: '(max-width: 599.98px)',
  [WindowClass.Medium]: '(min-width: 600px) and (max-width: 839.98px)',
  [WindowClass.Expanded]: '(min-width: 840px) and (max-width: 1199.98px)',
  [WindowClass.Large]: '(min-width: 1200px) and (max-width: 1599.98px)',
  [WindowClass.ExtraLarge]: '(min-width: 1600px)',
} as const
