CREATE TABLE "auth"."Role" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR(20) NOT NULL UNIQUE,
  "description" VARCHAR(255),
  "default" BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE FUNCTION "auth"."fn_role_default_count"() RETURNS INTEGER
AS $$
  DECLARE
    default_count INTEGER;
  BEGIN
    SELECT COUNT(*) INTO default_count FROM "auth"."Role" WHERE "default" = TRUE;
  RETURN
    default_count;
  END;
$$ LANGUAGE plpgsql;

ALTER TABLE "auth"."Role" ADD CONSTRAINT "CHK_Role_Default" CHECK (
  "auth"."fn_role_default_count"() <= 1
);

COMMENT ON TABLE "auth"."Role" IS 'A role';
COMMENT ON COLUMN "auth"."Role"."name" IS 'The name of the role';
COMMENT ON COLUMN "auth"."Role"."description" IS 'The description of the role';
COMMENT ON COLUMN "auth"."Role"."default" IS 'Whether the role is the default role';
COMMENT ON CONSTRAINT "CHK_Role_Default" ON "auth"."Role" IS 'Only one default role is allowed';
COMMENT ON FUNCTION "auth"."fn_role_default_check"() IS 'Calculate the number of default roles';
