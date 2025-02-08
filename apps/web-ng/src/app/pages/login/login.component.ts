import { ChangeDetectionStrategy, Component } from '@angular/core'

import { LoginComponent } from '@features/authentication/login'

@Component({
  standalone: true,
  selector: 'neko-login-page',
  imports: [LoginComponent],
  templateUrl: 'login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {}
