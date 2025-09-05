import { ComponentPortal, PortalContext } from '../portal'

export interface PopoverContext<T = unknown, Context = unknown> {
  readonly id: string
  readonly context?: PortalContext<Context>
  readonly component: ComponentPortal<T>
  readonly close: () => void
}
