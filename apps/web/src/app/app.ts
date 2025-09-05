import { ChangeDetectionStrategy, Component, DOCUMENT, inject, OnInit, ViewContainerRef } from '@angular/core'
import { RouterOutlet } from '@angular/router'

import { SnackbarOutlet } from '@/shared/snackbar'
import { Portal } from '@/shared/portal'

@Component({
  selector: 'n-root',
  imports: [RouterOutlet, SnackbarOutlet],
  template: `<router-outlet /><n-snackbar-outlet />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit {
  private readonly document = inject(DOCUMENT)
  private readonly portal = inject(Portal)
  private readonly vcr = inject(ViewContainerRef)

  ngOnInit(): void {
    const attributes = ['nBlurOnClick', 'nButton', 'nIconButton']

    // hack to remove focus from elements on click
    this.document.addEventListener(
      'click',
      (event: Event) => {
        const target = event.target as HTMLElement
        if (attributes.some((attribute) => target.hasAttribute(attribute))) {
          requestAnimationFrame(() => target.blur())
        }
      },
      { capture: true, passive: true },
    )

    this.portal.attach(this.vcr)
  }
}
