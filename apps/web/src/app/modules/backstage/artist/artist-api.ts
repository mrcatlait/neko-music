import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Contracts } from '@neko/contracts'
import { Observable } from 'rxjs'

import { ENVIRONMENT } from '@/core/providers'

@Injectable()
export class ArtistApi {
  private readonly http = inject(HttpClient)
  private readonly apiUrl = inject(ENVIRONMENT).apiUrl

  create(
    payload: Contracts.Backstage.Artists.CreationRequest,
  ): Observable<Contracts.Backstage.Artists.CreationResponse> {
    return this.http.post<Contracts.Backstage.Artists.CreationResponse>(`${this.apiUrl}/backstage/artists`, payload)
  }

  getArtist(id: string): Observable<Contracts.Backstage.Artists.Artist> {
    return this.http.get<Contracts.Backstage.Artists.Artist>(`${this.apiUrl}/backstage/artists/${id}`)
  }

  updateArtist(
    id: string,
    payload: Contracts.Backstage.Artists.UpdateRequest,
  ): Observable<Contracts.Backstage.Artists.UpdateResponse> {
    return this.http.put<Contracts.Backstage.Artists.UpdateResponse>(`${this.apiUrl}/backstage/artists/${id}`, payload)
  }

  getStatistics(): Observable<Contracts.Backstage.Artists.StatisticsResponse> {
    return this.http.get<Contracts.Backstage.Artists.StatisticsResponse>(`${this.apiUrl}/backstage/artists/statistics`)
  }
}
