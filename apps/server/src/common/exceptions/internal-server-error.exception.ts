import { HttpException } from './http.exception'

import { HttpStatus } from '@common/enums'

export class InternalServerErrorException extends HttpException {
  constructor(message: string = 'Internal Server Error') {
    super(HttpStatus.INTERNAL_SERVER_ERROR, message)
  }
}
