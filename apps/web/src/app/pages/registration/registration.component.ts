import { ChangeDetectionStrategy, Component } from '@angular/core'

import { RegistrationComponent } from '@features/authentication/registration'

@Component({
  standalone: true,
  selector: 'neko-registration-page',
  imports: [RegistrationComponent],
  templateUrl: 'registration.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationPage {}
