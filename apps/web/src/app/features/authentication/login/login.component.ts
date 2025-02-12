import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { loginSelectors } from '@neko/ui-selectors'
import { AutofocusDirective, ButtonDirective, SelectorDirective } from '@neko/ui-shared/directives'
import { AuthStatus, AuthFacade } from '@neko/ui-auth'
import { ErrorComponent, TextfieldComponent } from '@neko/ui-shared/components'
import { injectEnvironment } from '@neko/ui-shared/providers'
import { emailValidator } from '@neko/ui-shared/validators'

@Component({
  standalone: true,
  selector: 'neko-login',
  templateUrl: 'login.component.html',
  styleUrl: 'login.component.scss',
  imports: [
    AutofocusDirective,
    SelectorDirective,
    ReactiveFormsModule,
    ErrorComponent,
    TextfieldComponent,
    ButtonDirective,
    RouterLink,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly router = inject(Router)
  private readonly authFacade = inject(AuthFacade)
  private readonly environment = injectEnvironment()

  hidePassword = true

  readonly loading = computed(() => this.authFacade.status() === AuthStatus.LOADING)
  readonly invalidCredentials = computed(() => this.authFacade.status() === AuthStatus.ERROR)

  readonly applicationName = this.environment.applicationName

  readonly selectors = loginSelectors

  form = new FormGroup({
    email: new FormControl('', [Validators.required, emailValidator]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  })

  constructor() {
    effect(() => {
      if (this.authFacade.status() === AuthStatus.SUCCESS) {
        this.router.navigate(['/'])
      }
    })
  }

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
