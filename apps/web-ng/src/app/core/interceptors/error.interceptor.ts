import { inject, Injectable } from '@angular/core'
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'

import { ErrorService } from '@core/services'

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private readonly errorService = inject(ErrorService)

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errorService.handleError(error)
        return throwError(() => error)
      }),
    )
  }
}
