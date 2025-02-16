import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { AuthFacade } from '@neko/ui-auth/auth.facade'
import { AvatarComponent, LogoComponent, MenuComponent, MenuItemComponent } from '@neko/ui-shared/components'
import { MenuTriggerDirective } from '@neko/ui-shared/directives'

@Component({
  selector: 'neko-header',
  imports: [AvatarComponent, LogoComponent, MenuComponent, MenuItemComponent, MenuTriggerDirective],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  readonly authFacade = inject(AuthFacade)

  handleLogout(): void {
    this.authFacade.logout()
  }
}
