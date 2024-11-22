import { HttpStatus } from '@common/enums'

export class HttpException extends Error {
  constructor(
    public status: HttpStatus,
    message: string | string[],
  ) {
    super(Array.isArray(message) ? message.join(', ') : message)
  }

  get response() {
    return {
      statusCode: this.status,
      message: this.message,
    }
  }
}
