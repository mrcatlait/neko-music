import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Contracts } from '@neko/contracts'

import { ENVIRONMENT } from '../providers'

@Injectable({
  providedIn: 'root',
})
export class AuthRepository {
  private readonly http = inject(HttpClient)
  private readonly apiUrl = inject(ENVIRONMENT).apiUrl

  login(payload: Contracts.Auth.LoginRequest): Observable<Contracts.Auth.LoginResponse> {
    return this.http.post<Contracts.Auth.LoginResponse>(`${this.apiUrl}/auth/login`, payload)
  }

  register(payload: Contracts.Auth.RegistrationRequest): Observable<Contracts.Auth.LoginResponse> {
    return this.http.post<Contracts.Auth.LoginResponse>(`${this.apiUrl}/auth/register`, payload)
  }

  logout() {
    return this.http.post<void>(`${this.apiUrl}/auth/logout`, {})
  }

  refresh(): Observable<Contracts.Auth.RefreshTokenResponse> {
    return this.http.get<Contracts.Auth.RefreshTokenResponse>(`${this.apiUrl}/auth/refresh`, { withCredentials: true })
  }

  whoami(): Observable<Contracts.Auth.LoginResponse> {
    return this.http.get<Contracts.Auth.LoginResponse>(`${this.apiUrl}/auth/whoami`, { withCredentials: true })
  }
}
