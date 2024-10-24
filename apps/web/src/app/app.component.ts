import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
  ViewChild,
  ViewContainerRef,
} from '@angular/core'

import { MediaQueryService, PortalService } from '@core/services'
import { AuthState } from '@core/state'

@Component({
  selector: 'neko-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements AfterViewInit {
  private readonly mediaQueryService = inject(MediaQueryService)
  private readonly portalService = inject(PortalService)
  private readonly authState = inject(AuthState)

  @ViewChild('viewContainer', { read: ViewContainerRef })
  private readonly vcr!: ViewContainerRef

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

    this.authState.checkSession()
  }

  ngAfterViewInit(): void {
    this.portalService.attach(this.vcr)
  }

  // @HostListener('mouseup', ['$event']) onMouseUp(event: MouseEvent) {
  //   const element = event.target as HTMLButtonElement
  //   element.blur()
  // }

  handleExpand() {
    this.expanded.set(true)
  }

  handleCollapse() {
    this.expanded.set(false)
  }
}
