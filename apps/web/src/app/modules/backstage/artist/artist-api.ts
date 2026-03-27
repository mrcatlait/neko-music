import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs'

import { ENVIRONMENT } from '@/core/providers'

@Injectable()
export class ArtistApi {
  private readonly http = inject(HttpClient)
  private readonly apiUrl = inject(ENVIRONMENT).apiUrl

  create(payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/backstage/artists`, payload)
  }

  getArtist(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/backstage/artists/${id}`)
  }

  getArtists(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/backstage/artists`)
  }

  updateArtist(id: string, payload: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/backstage/artists/${id}`, payload)
  }

  getStatistics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/backstage/artists/statistics`)
  }
}
