CREATE TABLE "auth"."RolePermission" (
  "roleId" UUID NOT NULL,
  "permissionId" UUID NOT NULL,
  PRIMARY KEY ("roleId", "permissionId"),
  CONSTRAINT "FK_RolePermission_Role" FOREIGN KEY ("roleId") REFERENCES "auth"."Role" ("id") ON DELETE CASCADE,
  CONSTRAINT "FK_RolePermission_Permission" FOREIGN KEY ("permissionId") REFERENCES "auth"."Permission" ("id") ON DELETE CASCADE
);

COMMENT ON TABLE "auth"."RolePermission" IS 'A relationship between a role and a permission';
COMMENT ON COLUMN "auth"."RolePermission"."roleId" IS 'Foreign key to the role';
COMMENT ON COLUMN "auth"."RolePermission"."permissionId" IS 'Foreign key to the permission';
