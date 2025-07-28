import { join } from 'path'

export const MEDIA_PATH = join(process.cwd(), 'media')
export const UPLOAD_PATH = join(MEDIA_PATH, 'upload')
export const TEMP_PATH = join(MEDIA_PATH, 'temp')
