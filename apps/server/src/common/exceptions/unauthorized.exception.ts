import { HttpException } from './http.exception'

import { HttpStatus } from '@common/enums'

export class UnauthorizedException extends HttpException {
  constructor(message: string = 'Unauthorized') {
    super(HttpStatus.UNAUTHORIZED, message)
  }
}
