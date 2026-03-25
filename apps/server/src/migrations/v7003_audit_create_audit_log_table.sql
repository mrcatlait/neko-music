CREATE TABLE "audit"."AuditLog" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "action" "audit"."Action" NOT NULL,
  "resourceType" "audit"."ResourceType" NOT NULL,
  "resourceId" UUID NOT NULL,
  "actorId" UUID NOT NULL,
  "payload" JSONB,
  "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE "audit"."AuditLog" IS 'A table to store audit logs';
COMMENT ON COLUMN "audit"."AuditLog"."id" IS 'The ID of the audit log';
COMMENT ON COLUMN "audit"."AuditLog"."action" IS 'The action performed on the resource';
COMMENT ON COLUMN "audit"."AuditLog"."resourceType" IS 'The type of resource';
COMMENT ON COLUMN "audit"."AuditLog"."resourceId" IS 'The ID of the resource';
COMMENT ON COLUMN "audit"."AuditLog"."actorId" IS 'The ID of the actor';
COMMENT ON COLUMN "audit"."AuditLog"."payload" IS 'The payload of the audit log';
COMMENT ON COLUMN "audit"."AuditLog"."timestamp" IS 'The date and time the audit log was created';
