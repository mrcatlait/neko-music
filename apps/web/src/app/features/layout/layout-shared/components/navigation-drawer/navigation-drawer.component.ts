import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink, RouterLinkActive } from '@angular/router'

@Component({
  selector: 'neko-navigation-drawer',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navigation-drawer.component.html',
  styleUrl: './navigation-drawer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationDrawerComponent {}
