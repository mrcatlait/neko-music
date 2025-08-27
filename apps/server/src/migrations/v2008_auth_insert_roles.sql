INSERT INTO "auth"."Role" ("name", "description", "default")
VALUES 
    ('admin', 'Administrator role', TRUE),
    ('user', 'User role', FALSE)
ON CONFLICT ("name") DO NOTHING;