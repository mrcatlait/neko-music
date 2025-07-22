TRUNCATE TABLE "music"."Artist" CASCADE;

INSERT INTO "music"."Artist" ("name", "verified", "artwork", "media_file_id") VALUES (
  'Podington Bear',
  TRUE,
  '{
    "url": "https://freemusicarchive.org/image/?file=images%2Fartists%2FPodington_Bear_-_20100419190435595.jpg&width=290&height=290&type=artist",
    "backgroundColor": "#2C1810",
    "textColor": "#F5F5DC"
  }'::JSONB,
  '123e4567-e89b-12d3-a456-426614174000'
);

INSERT INTO "music"."Artist" ("name", "verified", "artwork", "media_file_id") VALUES (
  'Black Ant',
  TRUE,
  '{
    "url": "https://freemusicarchive.org/image/?file=images%2Fartists%2FBlack_Ant_-_20100815203310658.png&width=290&height=290&type=artist",
    "backgroundColor": "#2C1810",
    "textColor": "#F5F5DC"
  }'::JSONB,
  '123e4567-e89b-12d3-a456-426614174000'
);
