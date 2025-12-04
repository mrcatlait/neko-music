INSERT INTO "auth"."RolePermission" ("roleId", "permissionId")
SELECT 
  (SELECT id FROM "auth"."Role" WHERE name = 'User'),
  p.id
FROM "auth"."Permission" p
WHERE p.name IN (
  'track.read',
  'library.read',
  'library.write',
  'playlist.read',
  'playlist.write',
  'playlist.follow',
  'genre.read',
  'album.read',
  'artist.read',
  'artist.follow',
  'user.read'
);
