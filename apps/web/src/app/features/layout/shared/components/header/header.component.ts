import { ChangeDetectionStrategy, Component, inject, linkedSignal } from '@angular/core'
import { AuthFacade } from '@neko/ui-auth'
import { AvatarComponent, LogoComponent, MenuComponent, MenuItemComponent } from '@neko/ui-shared/components'
import { InitialsPipe } from '@neko/ui-shared/pipes'
import { MenuTriggerDirective } from '@neko/ui-shared/directives'

@Component({
  selector: 'neko-header',
  imports: [AvatarComponent, LogoComponent, InitialsPipe, MenuComponent, MenuItemComponent, MenuTriggerDirective],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  readonly authFacade = inject(AuthFacade)

  readonly displayName = linkedSignal(() => this.authFacade.session()?.displayName)

  handleLogout(): void {
    this.authFacade.logout()
  }
}
