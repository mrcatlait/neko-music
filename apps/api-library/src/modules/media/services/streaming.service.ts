import { Inject, Injectable, StreamableFile } from '@nestjs/common'

import { MediaModuleOptions } from '../types'
import { MEDIA_MODULE_OPTIONS } from '../tokens'
import { StorageStrategy } from '../strategies/storage'
import { NamingStrategy } from '../strategies/naming'

@Injectable()
export class StreamingService {
  private readonly storageStrategy: StorageStrategy
  private readonly namingStrategy: NamingStrategy

  constructor(@Inject(MEDIA_MODULE_OPTIONS) private readonly options: MediaModuleOptions) {
    this.storageStrategy = options.storageStrategy
    this.namingStrategy = options.namingStrategy
  }

  streamManifest(trackId: string): StreamableFile {
    const manifestFileName = this.namingStrategy.generateDashManifestName()
    const filePath = this.namingStrategy.generateFileName(manifestFileName, trackId)
    return new StreamableFile(this.storageStrategy.downloadToStream(filePath))
  }

  streamSegment(trackId: string, segmentFileName: string): StreamableFile {
    const filePath = this.namingStrategy.generateFileName(segmentFileName, trackId)
    return new StreamableFile(this.storageStrategy.downloadToStream(filePath))
  }
}
