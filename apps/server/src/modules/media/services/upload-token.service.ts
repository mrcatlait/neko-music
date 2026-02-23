import { Injectable } from '@nestjs/common'
import { FastifyRequest } from 'fastify'

import { UPLOAD_TOKEN_HEADER_NAME } from '../constants'

@Injectable()
export class UploadTokenService {
  private readonly uploadTokenHeaderName = UPLOAD_TOKEN_HEADER_NAME

  extractUploadTokenFromHeader(request: FastifyRequest): string | undefined {
    const token = request.headers[this.uploadTokenHeaderName]

    if (typeof token !== 'string') {
      return undefined
    }

    return token
  }
}
