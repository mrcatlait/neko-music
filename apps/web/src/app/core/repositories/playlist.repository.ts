import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { map, Observable } from 'rxjs'
import { injectEnvironment } from '@neko/ui-shared/providers'

import {
  AddPlaylistTrackDto,
  CreatePlaylistDto,
  PageOptionsDto,
  PageResponseDto,
  PlaylistDto,
  RemovePlaylistTrackDto,
  UpdatePlaylistDto,
  UpdatePlaylistTracksDto,
} from '@core/dtos'
import { Playlist } from '@core/interfaces'
import { mapPlaylistDtoToModel } from '@core/mappers'

@Injectable({
  providedIn: 'root',
})
export class PlaylistRepository {
  private readonly httpClient = inject(HttpClient)
  private readonly environment = injectEnvironment()

  createPlaylist(createPlaylistDto: CreatePlaylistDto): Observable<void> {
    return this.httpClient.post<void>(`${this.environment.apiUrl}/playlists`, createPlaylistDto)
  }

  updatePlaylist(playlistId: string, updatePlaylistDto: UpdatePlaylistDto): Observable<void> {
    return this.httpClient.put<void>(`${this.environment.apiUrl}/playlists/${playlistId}`, updatePlaylistDto)
  }

  deletePlaylist(playlistId: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.environment.apiUrl}/playlists/${playlistId}`)
  }

  getPlaylist(playlistId: string): Observable<PlaylistDto> {
    return this.httpClient.get<PlaylistDto>(`${this.environment.apiUrl}/playlists/${playlistId}`)
  }

  getMyPlaylists({ take, offset }: PageOptionsDto): Observable<Playlist[]> {
    return this.httpClient
      .get<PageResponseDto<PlaylistDto>>(`${this.environment.apiUrl}/playlists/me`, {
        params: { take, offset } as PageOptionsDto,
      })
      .pipe(map((dto) => dto.data.map(mapPlaylistDtoToModel)))
  }

  addTracksToPlaylist(playlistId: string, addPlaylistTrackDto: AddPlaylistTrackDto): Observable<void> {
    return this.httpClient.post<void>(`${this.environment.apiUrl}/playlists/${playlistId}/tracks`, addPlaylistTrackDto)
  }

  updateTracksInPlaylist(playlistId: string, updatePlaylistTracksDto: UpdatePlaylistTracksDto): Observable<void> {
    return this.httpClient.put<void>(
      `${this.environment.apiUrl}/playlists/${playlistId}/tracks`,
      updatePlaylistTracksDto,
    )
  }

  removeTracksFromPlaylist(playlistId: string, removePlaylistTrackDto: RemovePlaylistTrackDto): Observable<void> {
    return this.httpClient.delete<void>(`${this.environment.apiUrl}/playlists/${playlistId}/tracks`, {
      body: removePlaylistTrackDto,
    })
  }
}
