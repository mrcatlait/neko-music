-- First, get the role IDs
WITH roles AS (
    SELECT id, name FROM "UserRole" WHERE name IN ('admin', 'user')
),

-- Get all permissions
permissions AS (
    SELECT id, action FROM "Permission"
)

-- Insert permissions for admin role (all permissions)
INSERT INTO "GrantedPermission" ("role_id", "permission_id")
SELECT 
    (SELECT id FROM roles WHERE name = 'admin'),
    p.id
FROM permissions p

-- Insert permissions for user role (limited permissions)
UNION ALL
SELECT 
    (SELECT id FROM roles WHERE name = 'user'),
    p.id
FROM permissions p
WHERE p.action IN (
    -- Basic read permissions
    'track:read',
    'library:read',
    'playlist:read',
    'album:read',
    'artist:read',
    -- Personal management permissions
    'playlist:create',
    'playlist:update',
    'playlist:delete',
    'playlist:follow',
    'artist:follow'
)
ON CONFLICT ("role_id", "permission_id") DO NOTHING;