import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'

import { API_URL } from '@core/tokens'
import { LoginDto, LoginResponseDto } from '@core/dto'

@Injectable({
  providedIn: 'root',
})
export class AuthRepository {
  private readonly httpClient = inject(HttpClient)
  private readonly apiUrl = inject(API_URL)

  login({ username, password }: LoginDto): Observable<LoginResponseDto> {
    return this.httpClient.post<LoginResponseDto>(`${this.apiUrl}/auth/login`, { username, password })
  }

  logout(): Observable<void> {
    return this.httpClient.post<void>(`${this.apiUrl}/auth/logout`, {})
  }

  refreshToken(): Observable<LoginResponseDto> {
    return this.httpClient.post<LoginResponseDto>(`${this.apiUrl}/auth/refresh`, {})
  }
}
