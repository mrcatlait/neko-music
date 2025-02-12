import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { map, Observable } from 'rxjs'
import { injectEnvironment } from '@neko/ui-shared/providers'

import { Artist, Track } from '@core/interfaces'
import { ArtistDto, PageOptionsDto, PageResponseDto, TrackDto } from '@core/dtos'
import { mapArtistDtoToModel, mapTrackDtoToModel } from '@core/mappers'

@Injectable({
  providedIn: 'root',
})
export class ArtistRepository {
  private readonly httpClient = inject(HttpClient)
  private readonly environment = injectEnvironment()

  getById(artistId: string): Observable<Artist> {
    return this.httpClient
      .get<ArtistDto>(`${this.environment.apiUrl}/artists/${artistId}`)
      .pipe(map((response) => mapArtistDtoToModel(response)))
  }

  getTracksById(artistId: string, { take, offset }: PageOptionsDto): Observable<Track[]> {
    return this.httpClient
      .get<PageResponseDto<TrackDto>>(`${this.environment.apiUrl}/artists/${artistId}/tracks`, {
        params: { take, offset } as PageOptionsDto,
      })
      .pipe(map((response) => response.data.map(mapTrackDtoToModel)))
  }

  // getAlbums(artistId: string, { take, offset }: PageOptionsDto): Observable<Album[]> {
  //   return this.httpClient
  //     .get<PageResponseDto<AlbumDto>>(`${this.apiUrl}/artists/${artistId}/albums`, {
  //       params: { take, offset } as PageOptionsDto,
  //     })
  //     .pipe(map((response) => response.data.map(mapAlbumDtoToModel)))
  // }

  // getSingles(artistId: string, { take, offset }: PageOptionsDto): Observable<Album[]> {
  //   return this.httpClient
  //     .get<PageResponseDto<AlbumDto>>(`${this.apiUrl}/artists/${artistId}/singles`, {
  //       params: { take, offset } as PageOptionsDto,
  //     })
  //     .pipe(map((response) => response.data.map(mapAlbumDtoToModel)))
  // }

  // getRelatedArtists(artistId: string, { take, offset }: PageOptionsDto): Observable<Artist[]> {
  //   return this.httpClient
  //     .get<PageResponseDto<ArtistDto>>(`${this.apiUrl}/artists/${artistId}/related`, {
  //       params: { take, offset } as PageOptionsDto,
  //     })
  //     .pipe(map((response) => response.data.map(mapArtistDtoToModel)))
  // }
}
