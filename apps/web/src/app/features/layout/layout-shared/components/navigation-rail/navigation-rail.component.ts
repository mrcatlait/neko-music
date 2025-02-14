import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { ButtonDirective } from '@neko/ui-shared/directives'

@Component({
  selector: 'neko-navigation-rail',
  imports: [ButtonDirective, RouterLink, RouterLinkActive],
  templateUrl: './navigation-rail.component.html',
  styleUrl: './navigation-rail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationRailComponent {
  @Output() expand = new EventEmitter<void>()
}
