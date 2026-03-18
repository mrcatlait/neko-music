import { SchemaPath, validate } from '@angular/forms/signals'

export const fileType = (path: SchemaPath<File | null>, allowedTypes: string[], options?: { message?: string }) => {
  validate(path, ({ value }) => {
    const file = value()

    if (!file) {
      return null
    }

    if (!allowedTypes.includes(file.type)) {
      return {
        kind: 'fileType',
        message: options?.message ?? `File type must be one of ${allowedTypes.join(', ')}`,
      }
    }

    return null
  })
}
