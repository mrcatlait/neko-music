import { inject, Injectable } from '@angular/core'
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'

import { AuthState } from '@core/state'

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly authState = inject(AuthState)

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    request = request.clone({
      withCredentials: true,
    })

    return next.handle(request).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401 && !this.isAuthRoute(request.url)) {
          this.authState.logout()
        }

        return throwError(() => error)
      }),
    )
  }

  private isAuthRoute(url: string): boolean {
    const authRoutes = ['/auth']
    return authRoutes.some((route) => url.includes(route))
  }
}
