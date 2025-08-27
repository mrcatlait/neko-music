import { getFileName } from './get-file-name.util'

export const getFileExtension = (filePath: string): string => {
  const fileName = getFileName(filePath)
  const fileExtension = fileName.split('.').pop()

  if (!fileExtension) {
    throw new Error('File extension not found')
  }

  return fileExtension
}
