import { File } from '@nest-lab/fastify-multer'

export class UploadMediaCommand {
  file: File
  userId: string
  token: string
}
