import { ProcessingJob, ProcessingStatus } from '../enums'

export interface ProcessingJobEntity {
  id: string
  pipelineId: string
  jobName: ProcessingJob
  jobOrder: number
  status: ProcessingStatus
  attempts?: number
  errorMessage?: string
  startedAt?: Date
  completedAt?: Date
}
