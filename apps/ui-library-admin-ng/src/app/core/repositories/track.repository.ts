import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { map, Observable } from 'rxjs'
import { injectEnvironment } from '@neko/ui-shared/providers'

import { PageOptionsDto, PageResponseDto, TrackDto } from '@core/dtos'
import { mapTrackDtoToModel } from '@core/mappers'
import { Track } from '@core/interfaces'

@Injectable({
  providedIn: 'root',
})
export class TrackRepository {
  private readonly httpClient = inject(HttpClient)
  private readonly environment = injectEnvironment()

  getPopular(): Observable<Track[]> {
    return this.httpClient
      .get<PageResponseDto<TrackDto>>(`${this.environment.apiUrl}/tracks/popular`)
      .pipe(map((response) => response.data.map(mapTrackDtoToModel)))
  }

  getNew(): Observable<Track[]> {
    return this.httpClient
      .get<PageResponseDto<TrackDto>>(`${this.environment.apiUrl}/tracks/new`)
      .pipe(map((response) => response.data.map(mapTrackDtoToModel)))
  }

  get({ take, offset }: PageOptionsDto): Observable<Track[]> {
    return this.httpClient
      .get<PageResponseDto<TrackDto>>(`${this.environment.apiUrl}/tracks`, {
        params: { take, offset } as PageOptionsDto,
      })
      .pipe(map((response) => response.data.map(mapTrackDtoToModel)))
  }
}
