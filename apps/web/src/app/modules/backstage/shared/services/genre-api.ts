import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { Contracts } from '@neko/contracts'

import { ENVIRONMENT } from '@/core/providers'

@Injectable()
export class GenreApi {
  private readonly http = inject(HttpClient)
  private readonly apiUrl = inject(ENVIRONMENT).apiUrl

  create(payload: Contracts.Backstage.GenreCreationRequest): Observable<Contracts.Backstage.GenreCreationResponse> {
    return this.http.post<Contracts.Backstage.GenreCreationResponse>(`${this.apiUrl}/backstage/genres`, payload)
  }

  getStatistics(): Observable<Contracts.Backstage.GenreStatisticsResponse> {
    return this.http.get<Contracts.Backstage.GenreStatisticsResponse>(`${this.apiUrl}/backstage/genres/statistics`)
  }

  getGenres(): Observable<Contracts.Backstage.GenresResponse> {
    return this.http.get<Contracts.Backstage.GenresResponse>(`${this.apiUrl}/backstage/genres`)
  }

  getGenre(id: string): Observable<Contracts.Backstage.Genre> {
    return this.http.get<Contracts.Backstage.Genre>(`${this.apiUrl}/backstage/genres/${id}`)
  }

  updateGenre(id: string, payload: Contracts.Backstage.GenreUpdateRequest): Observable<Contracts.Backstage.Genre> {
    return this.http.put<Contracts.Backstage.Genre>(`${this.apiUrl}/backstage/genres/${id}`, payload)
  }
}
