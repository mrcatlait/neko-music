import { HttpInterceptorFn, HttpErrorResponse, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http'
import { inject } from '@angular/core'
import { catchError, switchMap, throwError, BehaviorSubject, filter, take, finalize, Observable } from 'rxjs'

import { AuthStore } from '../stores/auth.state'
import { AuthRepository } from '../repositories/auth.repository'

let isRefreshing = false
const refreshTokenSubject = new BehaviorSubject<string | null>(null)

export const jwtInterceptor: HttpInterceptorFn = (request, next) => {
  const authStore = inject(AuthStore)
  const authRepository = inject(AuthRepository)

  const accessToken = authStore.accessToken()

  if (accessToken) {
    request = addTokenHeader(request, accessToken)
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      // Only handle 401 errors for non-refresh endpoints
      if (error.status === 401 && !request.url.includes('/auth/refresh')) {
        return handle401Error(request, next, authStore, authRepository)
      }

      return throwError(() => error)
    }),
  )
}

function handle401Error(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authStore: AuthStore,
  authRepository: AuthRepository,
): Observable<HttpEvent<unknown>> {
  if (!isRefreshing) {
    isRefreshing = true
    refreshTokenSubject.next(null)

    return authRepository.refresh().pipe(
      switchMap((response) => {
        // Update access token in store
        authStore.updateAccessToken(response.accessToken)
        refreshTokenSubject.next(response.accessToken)

        // Retry original request with new token
        const retryRequest = addTokenHeader(request, response.accessToken)

        return next(retryRequest)
      }),
      catchError((refreshError) => {
        // Refresh failed - logout user
        authStore.logout()
        return throwError(() => refreshError)
      }),
      finalize(() => {
        isRefreshing = false
      }),
    )
  } else {
    // Token refresh is in progress, wait for completion
    return refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => {
        const retryRequest = addTokenHeader(request, token)
        return next(retryRequest)
      }),
    )
  }
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
