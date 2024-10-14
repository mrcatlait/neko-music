import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { map, Observable } from 'rxjs'

import { API_URL } from '@core/tokens'
import { ArtistDto, PageOptionsDto, PageResponseDto, TrackDto } from '@core/dto'
import { mapArtistDtoToModel, mapTrackDtoToModel } from '@core/mappers'
import { Artist, Track } from '@core/models'

@Injectable({
  providedIn: 'root',
})
export class ArtistRepository {
  private readonly httpClient = inject(HttpClient)
  private readonly apiUrl = inject(API_URL)

  getById(artistId: string): Observable<Artist> {
    return this.httpClient
      .get<ArtistDto>(`${this.apiUrl}/artists/${artistId}`)
      .pipe(map((response) => mapArtistDtoToModel(response)))
  }

  getTracksById(artistId: string, { take, offset }: PageOptionsDto): Observable<Track[]> {
    return this.httpClient
      .get<PageResponseDto<TrackDto>>(`${this.apiUrl}/artists/${artistId}/tracks`, {
        params: { take, offset } as PageOptionsDto,
      })
      .pipe(map((response) => response.data.map(mapTrackDtoToModel)))
  }
}
