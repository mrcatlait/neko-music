CREATE TYPE "audit"."Action" AS ENUM (
  'CREATE',
  'UPDATE',
  'DELETE',
  'PUBLISH'
);

COMMENT ON TYPE "audit"."Action" IS 'The action performed on an entity';
