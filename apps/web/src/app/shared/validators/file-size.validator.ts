import { SchemaPath, validate } from '@angular/forms/signals'

import { BytesPipe } from '../pipes'

export const fileSize = (path: SchemaPath<File | null>, maxSize: number, options?: { message?: string }) => {
  validate(path, ({ value }) => {
    const file = value()

    if (!file) {
      return null
    }

    if (file.size > maxSize) {
      return {
        kind: 'fileSize',
        message: options?.message ?? `File size must be less than ${new BytesPipe().transform(maxSize)}`,
      }
    }

    return null
  })
}
