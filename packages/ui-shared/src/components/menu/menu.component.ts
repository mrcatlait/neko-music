import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'neko-menu',
  template: `
    <ul>
      <ng-content />
    </ul>
  `,
  styleUrl: './menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent {}
