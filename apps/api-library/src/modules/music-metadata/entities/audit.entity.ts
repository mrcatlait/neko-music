export interface AuditEntity {
  createdAt: Date
  updatedAt: Date
}

export type WithAudit<T> = T & AuditEntity
