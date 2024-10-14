import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'neko-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent {}
