import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'

import { LoginDto, LoginResponseDto } from '../dto'
import { injectApiUrl } from '../tokens'

@Injectable()
export class AuthRepository {
  private readonly httpClient = inject(HttpClient)
  private readonly apiUrl = injectApiUrl()

  login(payload: LoginDto): Observable<LoginResponseDto> {
    return this.httpClient.post<LoginResponseDto>(`${this.apiUrl}/auth/login`, payload)
  }

  logout(): Observable<void> {
    return this.httpClient.post<void>(`${this.apiUrl}/auth/logout`, {})
  }

  whoAmI(): Observable<LoginResponseDto> {
    return this.httpClient.get<LoginResponseDto>(`${this.apiUrl}/auth/whoami`)
  }
}
