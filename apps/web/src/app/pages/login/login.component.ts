import { ChangeDetectionStrategy, Component } from '@angular/core'

import { LoginComponent } from '@features/authentication/login'
import { SharedModule } from '@shared/shared.module'

@Component({
  standalone: true,
  selector: 'neko-login-page',
  imports: [SharedModule, LoginComponent],
  templateUrl: 'login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {}
