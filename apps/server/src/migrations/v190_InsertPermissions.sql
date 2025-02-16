-- Track Permissions
INSERT INTO "Permission" ("action", "description")
VALUES 
    ('track:read', 'Ability to view track information'),
    ('track:create', 'Ability to create new tracks'),
    ('track:update', 'Ability to modify track information'),
    ('track:delete', 'Ability to remove tracks'),
    ('track:download', 'Ability to download tracks')
ON CONFLICT ("action") DO NOTHING;

-- Library Permissions
INSERT INTO "Permission" ("action", "description")
VALUES 
    ('library:read', 'Ability to view library contents'),
    ('library:create', 'Ability to create new libraries'),
    ('library:update', 'Ability to modify library information'),
    ('library:delete', 'Ability to delete libraries')
ON CONFLICT ("action") DO NOTHING;

-- Playlist Permissions
INSERT INTO "Permission" ("action", "description")
VALUES 
    ('playlist:read', 'Ability to view playlists'),
    ('playlist:create', 'Ability to create new playlists'),
    ('playlist:update', 'Ability to modify playlists'),
    ('playlist:delete', 'Ability to delete playlists'),
    ('playlist:follow', 'Ability to follow playlists')
ON CONFLICT ("action") DO NOTHING;

-- Album Permissions
INSERT INTO "Permission" ("action", "description")
VALUES 
    ('album:read', 'Ability to view album information'),
    ('album:create', 'Ability to create new albums'),
    ('album:update', 'Ability to modify album information'),
    ('album:delete', 'Ability to delete albums'),
    ('album:download', 'Ability to download albums')
ON CONFLICT ("action") DO NOTHING;

-- Artist Permissions
INSERT INTO "Permission" ("action", "description")
VALUES 
    ('artist:read', 'Ability to view artist information'),
    ('artist:create', 'Ability to create new artists'),
    ('artist:update', 'Ability to modify artist information'),
    ('artist:delete', 'Ability to delete artists'),
    ('artist:follow', 'Ability to follow artists')
ON CONFLICT ("action") DO NOTHING;

-- User Permissions
INSERT INTO "Permission" ("action", "description")
VALUES 
    ('user:read', 'Ability to view user information'),
    ('user:create', 'Ability to create new users'),
    ('user:update', 'Ability to modify user information'),
    ('user:delete', 'Ability to delete users')
ON CONFLICT ("action") DO NOTHING;