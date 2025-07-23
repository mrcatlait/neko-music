import { ProcessingStatus } from '../enums'

export interface ProcessingPipelineEntity {
  id: string
  mediaFileId: string
  processingStatus: ProcessingStatus
  attempts: number
  errorMessage?: string
}
