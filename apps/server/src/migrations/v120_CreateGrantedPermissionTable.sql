CREATE TABLE "GrantedPermission" (
  "role_id" UUID NOT NULL,
  "permission_id" UUID NOT NULL,
  PRIMARY KEY ("role_id", "permission_id"),
  CONSTRAINT "FK_GrantedPermission_Role" FOREIGN KEY ("role_id") REFERENCES "Role" ("id"),
  CONSTRAINT "FK_GrantedPermission_Permission" FOREIGN KEY ("permission_id") REFERENCES "Permission" ("id")
);
