import { ChangeDetectionStrategy, Component, effect, HostListener, inject, signal } from '@angular/core'

import { MediaQueryService } from '@core/services'

@Component({
  selector: 'neko-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private readonly mediaQueryService = inject(MediaQueryService)

  private readonly isMediumScreen = this.mediaQueryService.isMediumScreen
  private readonly isExpandedScreen = this.mediaQueryService.isExpandedScreen
  readonly expanded = signal(false)

  constructor() {
    effect(
      () => {
        if (!this.isMediumScreen() && !this.isExpandedScreen()) {
          this.expanded.set(false)
        }
      },
      { allowSignalWrites: true },
    )
  }

  @HostListener('mouseup', ['$event']) onMouseUp(event: MouseEvent) {
    const element = event.target as HTMLButtonElement
    element.blur()
  }

  handleExpand() {
    this.expanded.set(true)
  }

  handleCollapse() {
    this.expanded.set(false)
  }
}
