import { ProcessingStatus } from '../enums'

export interface ProcessingPipelineEntity {
  id: string
  assetId: string
  processingJob: string
  status: ProcessingStatus
  attempts: number
  errorMessage?: string
  startedAt?: Date
  completedAt?: Date
}
