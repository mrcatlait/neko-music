import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Contracts } from '@neko/contracts'
import { Observable } from 'rxjs'

import { ENVIRONMENT } from '@/core/providers'

@Injectable()
export class AlbumApi {
  private readonly http = inject(HttpClient)
  private readonly apiUrl = inject(ENVIRONMENT).apiUrl

  create(payload: Contracts.Backstage.Albums.CreationRequest): Observable<Contracts.Backstage.Albums.CreationResponse> {
    return this.http.post<Contracts.Backstage.Albums.CreationResponse>(`${this.apiUrl}/backstage/albums`, payload)
  }
}
