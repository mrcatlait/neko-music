import { ChangeDetectionStrategy, Component, inject } from '@angular/core'

import { WindowClassDetector } from './layout-shared/services'
import { WindowClass } from './layout-shared/enums'
import { LayoutExtraLargeComponent } from './layout-extra-large'
import { LayoutCompactComponent } from './layout-compact'
import { LayoutMediumComponent } from './layout-medium'

@Component({
  selector: 'neko-layout',
  imports: [LayoutCompactComponent, LayoutExtraLargeComponent, LayoutMediumComponent],
  providers: [],
  template: `
    @switch (currentWindowClass()) {
      @case (WindowClass.Compact) {
        @defer {
          <neko-layout-compact />
        } @loading {
          <!-- <app-layout-skeleton /> -->
        }
      }
      @case (WindowClass.Medium) {
        @defer {
          <neko-layout-medium />
        } @loading {
          <!-- <app-layout-skeleton /> -->
        }
      }
      <!--  @case (WindowClass.Medium) {
      @case (WindowClass.Expanded) {
        @defer {
          <app-desktop-layout />
        } @loading {
          <app-layout-skeleton />
        }
      }
      @case (WindowClass.Large) {
        @defer {
          <app-desktop-layout />
        } @loading {
          <app-layout-skeleton />
        }
      } -->
      @case (WindowClass.ExtraLarge) {
        @defer {
          <neko-layout-extra-large />
        } @loading {
          <!-- <app-layout-skeleton /> -->
        }
      }
      @default {
        @defer {
          <neko-layout-extra-large />
        } @loading {
          <!-- <app-layout-skeleton /> -->
        }
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  private readonly windowClassDetector = inject(WindowClassDetector)

  readonly WindowClass = WindowClass
  readonly currentWindowClass = this.windowClassDetector.windowClass
}
