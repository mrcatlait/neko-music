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
    return this.http.post<Contracts.Auth.LoginResponse>(`${this.apiUrl}/auth/login`, payload, {
      withCredentials: true,
    })
  }

  register(payload: Contracts.Auth.RegistrationRequest): Observable<Contracts.Auth.LoginResponse> {
    return this.http.post<Contracts.Auth.LoginResponse>(`${this.apiUrl}/auth/register`, payload, {
      withCredentials: true,
    })
  }

  logout() {
    return this.http.post<void>(
      `${this.apiUrl}/auth/logout`,
      {},
      {
        withCredentials: true,
      },
    )
  }

  refresh(): Observable<Contracts.Auth.RefreshTokenResponse> {
    return this.http.get<Contracts.Auth.RefreshTokenResponse>(`${this.apiUrl}/auth/refresh`, {
      withCredentials: true,
    })
  }

  whoami(): Observable<Contracts.Auth.WhoamiResponse> {
    return this.http.get<Contracts.Auth.WhoamiResponse>(`${this.apiUrl}/auth/whoami`)
  }
}
