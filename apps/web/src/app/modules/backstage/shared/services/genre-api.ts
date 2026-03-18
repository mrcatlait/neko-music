import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { Contracts } from '@neko/contracts'

import { ENVIRONMENT } from '@/core/providers'

@Injectable()
export class GenreApi {
  private readonly http = inject(HttpClient)
  private readonly apiUrl = inject(ENVIRONMENT).apiUrl

  create(payload: Contracts.Backstage.Genres.CreationRequest): Observable<Contracts.Backstage.Genres.CreationResponse> {
    return this.http.post<Contracts.Backstage.Genres.CreationResponse>(`${this.apiUrl}/backstage/genres`, payload)
  }

  getStatistics(): Observable<Contracts.Backstage.Genres.StatisticsResponse> {
    return this.http.get<Contracts.Backstage.Genres.StatisticsResponse>(`${this.apiUrl}/backstage/genres/statistics`)
  }

  getGenres(): Observable<Contracts.Backstage.Genres.GenresResponse> {
    return this.http.get<Contracts.Backstage.Genres.GenresResponse>(`${this.apiUrl}/backstage/genres`)
  }

  getGenre(id: string): Observable<Contracts.Backstage.Genres.Genre> {
    return this.http.get<Contracts.Backstage.Genres.Genre>(`${this.apiUrl}/backstage/genres/${id}`)
  }

  updateGenre(
    id: string,
    payload: Contracts.Backstage.Genres.UpdateRequest,
  ): Observable<Contracts.Backstage.Genres.CreationResponse> {
    return this.http.put<Contracts.Backstage.Genres.CreationResponse>(`${this.apiUrl}/backstage/genres/${id}`, payload)
  }
}
