import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  standalone: true,
  selector: 'neko-login-page',
  imports: [],
  templateUrl: 'login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {}
