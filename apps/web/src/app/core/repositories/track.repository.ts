import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { map } from 'rxjs'

import { API_URL } from '@core/tokens'
import { PageOptionsDto, PageResponseDto, TrackDto } from '@core/dto'

@Injectable({
  providedIn: 'root',
})
export class TrackRepository {
  private readonly httpClient = inject(HttpClient)
  private readonly apiUrl = inject(API_URL)

  getPopular() {
    return this.httpClient
      .get<PageResponseDto<TrackDto>>(`${this.apiUrl}/tracks/popular`, {
        params: { take: 12, offset: 0 } as PageOptionsDto,
      })
      .pipe(map((response) => response.data))
  }

  getNew() {
    return this.httpClient
      .get<PageResponseDto<TrackDto>>(`${this.apiUrl}/tracks/new`, {
        params: { take: 6, offset: 1 } as PageOptionsDto,
      })
      .pipe(map((response) => response.data))
  }

  get({ take, offset }: PageOptionsDto) {
    return this.httpClient.get<PageResponseDto<TrackDto>>(`${this.apiUrl}/tracks`, {
      params: { take, offset } as PageOptionsDto,
    })
  }
}
