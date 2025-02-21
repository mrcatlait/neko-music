CREATE TABLE "auth"."GrantedPermission" (
  "role_id" UUID NOT NULL,
  "permission_id" UUID NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("role_id", "permission_id"),
  CONSTRAINT "FK_GrantedPermission_Role" FOREIGN KEY ("role_id") REFERENCES "auth"."Role" ("id"),
  CONSTRAINT "FK_GrantedPermission_Permission" FOREIGN KEY ("permission_id") REFERENCES "auth"."Permission" ("id")
);
