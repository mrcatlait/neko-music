import { EMPTY, throwError } from 'rxjs'
import { catchError, switchMap } from 'rxjs/operators'
import { HttpRequest, HttpHandler, HttpInterceptor } from '@angular/common/http'
import { Injectable } from '@angular/core'

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(this.addToken(req)).pipe(
      catchError((error) => {
        if (error.status === 401) {
          return this.handleUnauthorized(req, next)
        }
        return throwError(() => error)
      }),
    )
  }

  private handleUnauthorized(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.refreshTokens().pipe(
      switchMap((tokens) => {
        if (tokens) {
          // Store new tokens
          this.tokenStorage.saveTokens(tokens)
          // Retry original request
          return next.handle(this.addToken(req))
        }
        // Redirect to login if refresh fails
        this.authService.logout()
        return EMPTY
      }),
    )
  }
}
