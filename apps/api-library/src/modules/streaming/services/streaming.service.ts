import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common'
import { createReadStream, existsSync } from 'fs'
import { join } from 'path'

import { STREAM_PATH } from '../constants'

@Injectable()
export class StreamingService {
  private readonly mockedTrackId = '457c78a5-5035-412e-9283-0d5bf09f9ecc'

  streamManifest(trackId: string): StreamableFile {
    const filePath = this.getManifestPath(this.mockedTrackId)
    return new StreamableFile(createReadStream(filePath))
  }

  streamSegment(trackId: string, segmentId: string): StreamableFile {
    const filePath = this.getSegmentPath(this.mockedTrackId, segmentId)
    return new StreamableFile(createReadStream(filePath))
  }

  private getManifestPath(trackId: string): string {
    const filePath = join(STREAM_PATH, 'tracks', trackId, 'manifest.mpd')

    console.log('filePath', filePath)

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
