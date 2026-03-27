import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common'
import Ajv from 'ajv'

/**
 * @todo Check performance of class-validator and class-transformer vs ajv
 * Custom validation pipe that uses Ajv to validate the data.
 */
@Injectable()
export class ValidationPipe implements PipeTransform {
  private readonly ajv: Ajv

  constructor(ajv?: Ajv) {
    if (!ajv) {
      ajv = new Ajv()
    }

    this.ajv = ajv
  }

  transform<T>(value: T, metadata: ArgumentMetadata): T {
    if (!metadata.data) {
      return value
      // throw new Error('Metadata data is required')
    }

    const isValid = this.ajv.validate(metadata.data, value)

    if (!isValid) {
      throw new BadRequestException(this.ajv.errors)
    }

    return value
  }
}
