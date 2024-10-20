import { ChangeDetectionStrategy, Component } from '@angular/core'

import { RegistrationComponent } from '@features/authentication/registration'
import { SharedModule } from '@shared/shared.module'

@Component({
  standalone: true,
  selector: 'neko-registration-page',
  imports: [SharedModule, RegistrationComponent],
  templateUrl: 'registration.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationPage {}
