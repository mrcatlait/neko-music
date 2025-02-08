import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { loginSelectors } from '@neko/ui-selectors'
import { ButtonDirective, SelectorDirective } from '@neko/ui-shared/directives'
import { AuthStatus, AuthFacade } from '@neko/ui-auth'
import { ErrorComponent, TextfieldComponent } from '@neko/ui-shared/components'
import { injectEnvironment } from '@neko/ui-shared/providers'

@Component({
  standalone: true,
  selector: 'neko-login',
  templateUrl: 'login.component.html',
  styleUrl: 'login.component.scss',
  imports: [SelectorDirective, ReactiveFormsModule, ErrorComponent, TextfieldComponent, ButtonDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly authFacade = inject(AuthFacade)
  private readonly environment = injectEnvironment()

  hidePassword = true

  readonly loading = computed(() => this.authFacade.status() === AuthStatus.LOADING)
  readonly invalidCredentials = computed(() => this.authFacade.error() === 'Invalid credentials')

  readonly applicationName = 'Neko'

  readonly selectors = loginSelectors

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  })

  handleSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }

    const email = this.form.controls.email.value ?? ''
    const password = this.form.controls.password.value ?? ''

    this.authFacade.login({ email, password })
  }
}
