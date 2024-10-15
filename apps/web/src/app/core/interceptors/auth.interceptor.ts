import { inject, Injectable } from '@angular/core'
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http'
import { BehaviorSubject, Observable, throwError } from 'rxjs'
import { catchError, filter, switchMap, take } from 'rxjs/operators'

import { AuthService } from '../services/auth.service'

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly authService = inject(AuthService)
  private isRefreshing = false

  private readonly refreshTokenSubject = new BehaviorSubject<string | null>(null)
  private readonly refreshToken$ = this.refreshTokenSubject.asObservable()

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const accessToken = this.authService.accessToken()

    if (accessToken) {
      request = this.addToken(request, accessToken)
    }

    return next.handle(request).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(request, next)
        }

        return throwError(() => error)
      }),
    )
  }

  private handle401Error(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true
      this.refreshTokenSubject.next(null)

      return this.authService.refreshToken().pipe(
        switchMap(({ accessToken }) => {
          this.isRefreshing = false
          this.refreshTokenSubject.next(accessToken)

          return next.handle(this.addToken(request, accessToken))
        }),
        catchError((error) => {
          this.isRefreshing = false
          this.authService.logout()

          return throwError(() => error)
        }),
      )
    }

    return this.refreshToken$.pipe(
      filter((token) => token != null),
      take(1),
      switchMap((jwt) => {
        return next.handle(this.addToken(request, jwt))
      }),
    )
  }

  private addToken(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    })
  }
}
