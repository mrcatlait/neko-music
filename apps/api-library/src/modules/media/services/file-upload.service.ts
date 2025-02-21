import { Injectable } from '@nestjs/common'
import { writeFileSync, unlinkSync } from 'fs'

@Injectable()
export class FileUploadService {
  uploadFile(filePath: string, file: Buffer): void {
    writeFileSync(filePath, file)
  }

  deleteFile(filePath: string): void {
    unlinkSync(filePath)
  }
}
