CREATE TABLE "audit"."AuditLog" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "action" "audit"."Action" NOT NULL,
  "resourceType" "audit"."ResourceType" NOT NULL,
  "resourceId" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "changes" JSONB,
  "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE "audit"."AuditLog" IS 'A table to store audit logs';
COMMENT ON COLUMN "audit"."AuditLog"."id" IS 'The ID of the audit log';
COMMENT ON COLUMN "audit"."AuditLog"."action" IS 'The action performed on the entity';
COMMENT ON COLUMN "audit"."AuditLog"."entity" IS 'The type of entity';
COMMENT ON COLUMN "audit"."AuditLog"."entityId" IS 'The ID of the entity';
COMMENT ON COLUMN "audit"."AuditLog"."userId" IS 'The ID of the user';
COMMENT ON COLUMN "audit"."AuditLog"."changes" IS 'The changes made to the entity';
COMMENT ON COLUMN "audit"."AuditLog"."timestamp" IS 'The date and time the audit log was created';
