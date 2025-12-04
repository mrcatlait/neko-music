INSERT INTO "auth"."RolePermission" ("roleId", "permissionId")
SELECT 
  (SELECT id FROM "auth"."Role" WHERE name = 'Super Admin'),
  p.id
FROM "auth"."Permission" p;
