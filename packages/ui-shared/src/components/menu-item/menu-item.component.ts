import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'neko-menu-item',
  template: `
    <li>
      <ng-content />
    </li>
  `,
  styleUrl: './menu-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuItemComponent {}
