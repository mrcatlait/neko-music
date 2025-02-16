import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'

import { injectAuthApiUrl } from '../tokens'
import { LoginDto, LoginResponseDto } from '../dto'

@Injectable({
  providedIn: 'root',
})
export class AuthRepository {
  private readonly httpClient = inject(HttpClient)
  private readonly apiUrl = injectAuthApiUrl()

  login(payload: LoginDto): Observable<LoginResponseDto> {
    return this.httpClient.post<LoginResponseDto>(`${this.apiUrl}/auth/login`, payload)
  }

  logout(): Observable<void> {
    return this.httpClient.post<void>(`${this.apiUrl}/auth/logout`, {})
  }

  whoami(): Observable<LoginResponseDto> {
    return this.httpClient.get<LoginResponseDto>(`${this.apiUrl}/auth/whoami`, { withCredentials: true })
  }
}
