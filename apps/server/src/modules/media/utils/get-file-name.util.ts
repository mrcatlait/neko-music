import { basename } from 'path'

export const getFileName = (filePath: string): string => {
  const fileName = basename(filePath)

  if (!fileName) {
    throw new Error('File name not found')
  }

  return fileName
}
