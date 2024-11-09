import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common'
import { createReadStream, existsSync } from 'fs'
import { join } from 'path'

import { STREAM_PATH } from '@common/constants'

@Injectable()
export class TrackStreamingService {
  streamManifest(trackId: string): StreamableFile {
    const filePath = this.getManifestPath(trackId)
    return new StreamableFile(createReadStream(filePath))
  }

  streamSegment(trackId: string, segmentId: string): StreamableFile {
    const filePath = this.getSegmentPath(trackId, segmentId)
    return new StreamableFile(createReadStream(filePath))
  }

  private getManifestPath(trackId: string): string {
    const filePath = join(STREAM_PATH, 'tracks', trackId, 'manifest.mpd')

    if (!existsSync(filePath)) {
      throw new NotFoundException()
    }

    return filePath
  }

  private getSegmentPath(trackId: string, segmentId: string): string {
    const filePath = join(STREAM_PATH, 'tracks', trackId, segmentId)

    if (!existsSync(filePath)) {
      throw new NotFoundException()
    }

    return filePath
  }
}
