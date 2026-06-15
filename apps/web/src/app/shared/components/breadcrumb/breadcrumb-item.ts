import { booleanAttribute, Directive, input } from '@angular/core'

@Directive({
  selector: 'n-breadcrumb-item,[nBreadcrumbItem]',
  standalone: true,
  host: {
    class: 'n-breadcrumb-item',
    role: 'listitem',
    '[attr.aria-current]': 'current() ? "page" : null',
    '[attr.data-breadcrumb-current]': 'current() ? "true" : null',
  },
})
export class BreadcrumbItem {
  current = input(false, { transform: booleanAttribute })
}
