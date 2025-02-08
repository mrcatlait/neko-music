import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { map, Observable } from 'rxjs'

import { API_URL } from '@core/tokens'
import { PageOptionsDto, PageResponseDto, TrackDto } from '@core/dto'
import { mapTrackDtoToModel } from '@core/mappers'
import { Track } from '@core/models'

@Injectable({
  providedIn: 'root',
})
export class TrackRepository {
  private readonly httpClient = inject(HttpClient)
  private readonly apiUrl = inject(API_URL)

  getPopular(): Observable<Track[]> {
    return this.httpClient
      .get<PageResponseDto<TrackDto>>(`${this.apiUrl}/tracks/popular`, {
        params: { take: 12, offset: 0 } as PageOptionsDto,
      })
      .pipe(map((response) => response.data.map(mapTrackDtoToModel)))
  }

  getNew(): Observable<Track[]> {
    return this.httpClient
      .get<PageResponseDto<TrackDto>>(`${this.apiUrl}/tracks/new`, {
        params: { take: 6, offset: 0 } as PageOptionsDto,
      })
      .pipe(map((response) => response.data.map(mapTrackDtoToModel)))
  }

  get({ take, offset }: PageOptionsDto): Observable<Track[]> {
    return this.httpClient
      .get<PageResponseDto<TrackDto>>(`${this.apiUrl}/tracks`, {
        params: { take, offset } as PageOptionsDto,
      })
      .pipe(map((response) => response.data.map(mapTrackDtoToModel)))
  }
}
