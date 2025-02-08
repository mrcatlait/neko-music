import { Injectable } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  handleError(error: Error | HttpErrorResponse): void {
    if (error instanceof HttpErrorResponse && error.status === 500) {
      console.error('Server error:', error)
    }
  }
}
