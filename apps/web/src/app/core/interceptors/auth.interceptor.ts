import { inject, Injectable } from '@angular/core'
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { Router } from '@angular/router'

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly router = inject(Router)

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    request = request.clone({
      withCredentials: true,
    })

    return next.handle(request).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401 && !this.isAuthRoute(request.url)) {
          this.router.navigate(['/login'])
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
