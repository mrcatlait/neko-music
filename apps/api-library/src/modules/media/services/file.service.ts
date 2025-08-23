import { Inject, Injectable } from '@nestjs/common'
import { fileTypeFromBuffer } from 'file-type'
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, unlinkSync, writeFileSync } from 'fs'
import { join } from 'path'

import { MEDIA_MODULE_OPTIONS } from '../tokens'
import { MediaModuleOptions } from '../types'

export interface SegmentInfo {
  segmentPaths: string[]
  totalSize: number
  segmentCount: number
  bitrateVariants: number
}

@Injectable()
export class FileService {
  private readonly temporaryDirectory: string

  constructor(@Inject(MEDIA_MODULE_OPTIONS) private readonly config: MediaModuleOptions) {
    this.temporaryDirectory = this.config.temporaryDirectory
  }

  createTemporaryDirectory(subdirectory?: string): string {
    const targetDirectory = join(this.temporaryDirectory, subdirectory ?? crypto.randomUUID())

    if (!existsSync(targetDirectory)) {
      mkdirSync(targetDirectory, { recursive: true })
    }

    return targetDirectory
  }
}
