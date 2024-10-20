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

  login({ email, password }: LoginDto): Observable<LoginResponseDto> {
    return this.httpClient.post<LoginResponseDto>(`${this.apiUrl}/auth/login`, { email, password })
  }

  register(payload: { username: string; email: string; password: string }) {
    return this.httpClient.post<unknown>(`${this.apiUrl}/auth/register`, payload)
  }

  logout(): Observable<void> {
    return this.httpClient.post<void>(`${this.apiUrl}/auth/logout`, {})
  }

  whoAmI(): Observable<LoginResponseDto> {
    return this.httpClient.post<LoginResponseDto>(`${this.apiUrl}/auth/whoami`, {})
  }
}
