import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs'

import { ENVIRONMENT } from '@/core/providers'

@Injectable()
export class GenreApi {
  private readonly http = inject(HttpClient)
  private readonly apiUrl = inject(ENVIRONMENT).apiUrl

  create(payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/backstage/genres`, payload)
  }

  getStatistics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/backstage/genres/statistics`)
  }

  getGenres(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/backstage/genres`)
  }

  getGenre(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/backstage/genres/${id}`)
  }

  updateGenre(id: string, payload: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/backstage/genres/${id}`, payload)
  }
}
