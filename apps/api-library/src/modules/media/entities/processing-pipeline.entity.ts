import { ProcessingStatus } from '../enums'

export interface ProcessingPipelineEntity {
  id: string
  sourceId: string
  status: ProcessingStatus
  startedAt?: Date
  completedAt?: Date
}
