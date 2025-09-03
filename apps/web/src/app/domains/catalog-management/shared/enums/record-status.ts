export const RECORD_STATUSES = {
  Draft: 'DRAFT',
  Published: 'PUBLISHED',
  Archived: 'ARCHIVED',
} as const

export type RecordStatus = (typeof RECORD_STATUSES)[keyof typeof RECORD_STATUSES]
