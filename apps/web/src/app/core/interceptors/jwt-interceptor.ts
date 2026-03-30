import { HttpInterceptorFn, HttpErrorResponse, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http'
import { inject } from '@angular/core'
import { catchError, switchMap, throwError, Observable } from 'rxjs'

import { AuthStore } from '@/core/auth/auth-store'
import { RefreshTokenAuthStrategy } from '@/core/auth/strategies'

export const jwtInterceptor: HttpInterceptorFn = (request, next) => {
  const refreshTokenAuth = inject(RefreshTokenAuthStrategy)

  const accessToken = inject(AuthStore).accessToken()

  if (accessToken) {
    request = addTokenHeader(request, accessToken)
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      // Only handle 401 errors for non-refresh endpoints
      if (error.status === 401 && !request.url.includes('/auth/refresh')) {
        return handle401Error(request, next, refreshTokenAuth)
      }

      return throwError(() => error)
    }),
  )
}

function handle401Error(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
  refreshTokenAuth: RefreshTokenAuthStrategy,
): Observable<HttpEvent<unknown>> {
  return refreshTokenAuth.refreshAccessToken().pipe(
    switchMap((accessToken) => {
      const retryRequest = addTokenHeader(request, accessToken)
      return next(retryRequest)
    }),
  )
}

const addTokenHeader = (request: HttpRequest<unknown>, token: string) => {
  const options: {
    setHeaders: Record<string, string>
    withCredentials?: boolean
  } = {
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }

  // Include credentials for auth endpoints to ensure cookies are sent
  if (request.url.includes('/auth/')) {
    options.withCredentials = true
  }

  return request.clone(options)
}
