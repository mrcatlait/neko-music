import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core'

type BreadcrumbSize = 'small' | 'medium'

@Component({
  selector: 'n-breadcrumb',
  standalone: true,
  template: `
    <nav
      class="n-breadcrumb"
      [attr.aria-label]="ariaLabel"
    >
      <ol class="n-breadcrumb__list">
        <ng-content />
      </ol>
    </nav>
  `,
  styleUrl: './breadcrumb.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-breadcrumb-size]': 'size',
  },
})
export class Breadcrumb {
  @Input()
  size: BreadcrumbSize = 'medium'

  @Input()
  ariaLabel = 'Breadcrumb'
}
