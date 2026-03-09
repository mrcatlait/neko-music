import { HttpClient, HttpHeaders } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { Contracts } from '@neko/contracts'

import { ENVIRONMENT } from '@/core/providers'

@Injectable()
export class MediaApi {
  private readonly http = inject(HttpClient)
  private readonly apiUrl = inject(ENVIRONMENT).apiUrl

  upload(file: File, token: string): Observable<Contracts.Media.UploadMediaResponse> {
    const formData = new FormData()
    formData.append('file', file)
    const headers = new HttpHeaders({ enctype: 'multipart/form-data', 'n-upload-token': token })

    // todo: handle 401 error to avoid redirecting to login page
    return this.http.post<Contracts.Media.UploadMediaResponse>(`${this.apiUrl}/media/upload`, formData, {
      headers,
    })
  }
}
