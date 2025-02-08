import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'

import { API_URL } from '@core/tokens'
import { LoginDto, LoginResponseDto, RegisterDto } from '@core/dto'

@Injectable({
  providedIn: 'root',
})
export class AuthRepository {
  private readonly httpClient = inject(HttpClient)
  private readonly apiUrl = inject(API_URL)

  login(payload: LoginDto): Observable<LoginResponseDto> {
    return this.httpClient.post<LoginResponseDto>(`${this.apiUrl}/auth/login`, payload)
  }

  register(payload: RegisterDto): Observable<LoginResponseDto> {
    return this.httpClient.post<LoginResponseDto>(`${this.apiUrl}/auth/register`, payload)
  }

  logout(): Observable<void> {
    return this.httpClient.post<void>(`${this.apiUrl}/auth/logout`, {})
  }

  whoAmI(): Observable<LoginResponseDto> {
    return this.httpClient.get<LoginResponseDto>(`${this.apiUrl}/auth/whoami`)
  }
}
