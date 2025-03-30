import { ProcessingStatus } from '../enums'

export interface ProcessingTaskEntity {
  id: string
  file_id: string
  status: ProcessingStatus
  error_message: string | null
  created_at: Date
  updated_at: Date
}
