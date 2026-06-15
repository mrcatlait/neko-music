import { Injectable } from '@nestjs/common'

import { MetadataClaim } from '../types'
import { MetadataClaimField } from '../enums'

@Injectable()
export class MetadataClaimMatchService {
  async match(metadataClaim: MetadataClaim): Promise<void> {
    switch (metadataClaim.field) {
      case MetadataClaimField.Album:
        return this.matchAlbum(metadataClaim)
      default:
        throw new Error(`Unsupported metadata claim field: ${metadataClaim.field}`)
    }
  }

  private async matchAlbum(metadataClaim: MetadataClaim): Promise<void> {
    // const album = await this.albumRepository.findByTitle(metadataClaim.value)
    // if (album) {
    //   return album
    // }
  }
}
