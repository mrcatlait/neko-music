import { HttpException } from './http.exception'

import { HttpStatus } from '@common/enums'

export class ForbiddenException extends HttpException {
  constructor(message: string = 'Forbidden') {
    super(HttpStatus.FORBIDDEN, message)
  }
}
