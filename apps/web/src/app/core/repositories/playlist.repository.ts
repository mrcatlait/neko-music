import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'

import { API_URL } from '@core/tokens'
import {
  AddPlaylistTrackDto,
  CreatePlaylistDto,
  PageOptionsDto,
  PageResponseDto,
  PlaylistDto,
  RemovePlaylistTrackDto,
  UpdatePlaylistDto,
  UpdatePlaylistTracksDto,
} from '@core/dto'

@Injectable({
  providedIn: 'root',
})
export class PlaylistRepository {
  private readonly httpClient = inject(HttpClient)
  private readonly apiUrl = inject(API_URL)

  createPlaylist(createPlaylistDto: CreatePlaylistDto): Observable<void> {
    return this.httpClient.post<void>(`${this.apiUrl}/playlists`, createPlaylistDto)
  }

  updatePlaylist(playlistId: string, updatePlaylistDto: UpdatePlaylistDto): Observable<void> {
    return this.httpClient.put<void>(`${this.apiUrl}/playlists/${playlistId}`, updatePlaylistDto)
  }

  deletePlaylist(playlistId: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/playlists/${playlistId}`)
  }

  getPlaylist(playlistId: string): Observable<PlaylistDto> {
    return this.httpClient.get<PlaylistDto>(`${this.apiUrl}/playlists/${playlistId}`)
  }

  getMyPlaylists({ take, offset }: PageOptionsDto): Observable<PageResponseDto<PlaylistDto>> {
    return this.httpClient.get<PageResponseDto<PlaylistDto>>(`${this.apiUrl}/playlists/me`, {
      params: { take, offset } as PageOptionsDto,
    })
  }

  addTracksToPlaylist(playlistId: string, addPlaylistTrackDto: AddPlaylistTrackDto): Observable<void> {
    return this.httpClient.post<void>(`${this.apiUrl}/playlists/${playlistId}/tracks`, addPlaylistTrackDto)
  }

  updateTracksInPlaylist(playlistId: string, updatePlaylistTracksDto: UpdatePlaylistTracksDto): Observable<void> {
    return this.httpClient.put<void>(`${this.apiUrl}/playlists/${playlistId}/tracks`, updatePlaylistTracksDto)
  }

  removeTracksFromPlaylist(playlistId: string, removePlaylistTrackDto: RemovePlaylistTrackDto): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/playlists/${playlistId}/tracks`, {
      body: removePlaylistTrackDto,
    })
  }
}
