import { ChangeDetectionStrategy, Component, DOCUMENT, inject, OnInit } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'

ModuleRegistry.registerModules([AllCommunityModule])

@Component({
  selector: 'n-root',
  imports: [RouterOutlet],
  template: `<router-outlet />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit {
  private readonly document = inject(DOCUMENT)

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
  }
}
