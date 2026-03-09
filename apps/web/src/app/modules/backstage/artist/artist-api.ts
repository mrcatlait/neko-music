import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Contracts } from '@neko/contracts'
import { Observable } from 'rxjs'

import { ENVIRONMENT } from '@/core/providers'

@Injectable()
export class ArtistApi {
  private readonly http = inject(HttpClient)
  private readonly apiUrl = inject(ENVIRONMENT).apiUrl

  create(payload: Contracts.Backstage.ArtistCreationRequest): Observable<Contracts.Backstage.ArtistCreationResponse> {
    return this.http.post<Contracts.Backstage.ArtistCreationResponse>(`${this.apiUrl}/backstage/artists`, payload)
  }
}
