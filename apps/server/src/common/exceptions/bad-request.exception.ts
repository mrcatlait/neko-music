import { HttpException } from './http.exception'

import { HttpStatus } from '@common/enums'

export class BadRequestException extends HttpException {
  constructor(message: string | string[] = 'Bad Request') {
    super(HttpStatus.BAD_REQUEST, message)
  }
}
