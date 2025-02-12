import { Injectable, inject, signal } from '@angular/core'
import { Router } from '@angular/router'
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { injectEnvironment } from '@neko/ui-shared/providers'

import { RegisterDto } from './register.dto'

@Injectable()
export class RegistrationState {
  private readonly httpClient = inject(HttpClient)
  private readonly router = inject(Router)
  private readonly environment = injectEnvironment()

  readonly loading = signal(false)

  readonly takenEmail = signal<string | null>(null)

  register(registerDto: RegisterDto) {
    this.loading.set(true)

    this.httpClient.post(`${this.environment.apiUrl}/auth/register`, registerDto).subscribe({
      next: () => {
        this.loading.set(false)
        this.router.navigate(['/login'])
      },
      error: (error) => {
        this.handleError({ error, email: registerDto.email })
      },
    })
  }

  private handleError(payload: { error: Error; email: string }) {
    this.loading.set(false)

    if (payload.error instanceof HttpErrorResponse) {
      const httpError = payload.error

      if (httpError.status !== 400 || !httpError.error) {
        return
      }

      const emailTaken = httpError.error.message.includes('emailTaken')

      if (emailTaken) {
        this.takenEmail.set(payload.email)
      }
    }
  }
}
