import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { map, Observable } from 'rxjs'

import { CollectionMembershipDto } from './dto'
import { CollectionType } from './enum'

import { PageOptionsDto, PageResponseDto } from '@core/dto'
import { API_URL } from '@core/tokens'

@Injectable()
export class PlaylistAddRepository {
  private readonly httpClient = inject(HttpClient)
  private readonly apiUrl = inject(API_URL)

  getCollectionMembership(
    collectionId: string,
    collectionType: CollectionType,
    pageOptionsDto: PageOptionsDto,
  ): Observable<CollectionMembershipDto[]> {
    return this.httpClient
      .get<PageResponseDto<CollectionMembershipDto>>(`${this.apiUrl}/playlists/me/collection-membership`, {
        params: {
          ...pageOptionsDto,
          collectionId,
          collectionType,
        },
      })
      .pipe(map((response) => response.data))
  }
}
