import { HttpException } from './http.exception'

import { HttpStatus } from '@common/enums'

export class NotFoundException extends HttpException {
  constructor(message: string = 'Not Found') {
    super(HttpStatus.NOT_FOUND, message)
  }
}
