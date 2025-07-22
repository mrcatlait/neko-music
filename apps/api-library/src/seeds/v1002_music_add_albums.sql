TRUNCATE TABLE "music"."Album" CASCADE;
TRUNCATE TABLE "music"."AlbumArtist" CASCADE;

-- Podington Bear / Solo Instruments
INSERT INTO "music"."Album" ("name", "release_date", "explicit", "type", "artwork", "media_file_id") VALUES (
  'Solo Instruments',
  '2013-04-03'::DATE,
  FALSE,
  'ALBUM',
  '{
    "url": "https://freemusicarchive.org/image/?file=images%2Falbums%2FPodington_Bear_-_Solo_Instruments_-_20140411174826786.jpg&width=290&height=290&type=album",
    "backgroundColor": "#000000",
    "textColor": "#FFFFFF"
  }'::JSONB,
  '123e4567-e89b-12d3-a456-426614174000'
);

INSERT INTO "music"."AlbumArtist" ("album_id", "artist_id") VALUES (
  (SELECT id FROM "music"."Album" WHERE name = 'Solo Instruments'),
  (SELECT id FROM "music"."Artist" WHERE name = 'Podington Bear')
);

-- Podington Bear / Panoramic / Ambient
INSERT INTO "music"."Album" ("name", "release_date", "explicit", "type", "artwork", "media_file_id") VALUES (
  'Panoramic / Ambient',
  '2013-04-04'::DATE,
  FALSE,
  'ALBUM',
  '{
    "url": "https://freemusicarchive.org/image/?file=images%2Falbums%2FPodington_Bear_-_Panoramic__Ambient_-_20140411174347914.jpg&width=290&height=290&type=album",
    "backgroundColor": "#000000",
    "textColor": "#FFFFFF"
  }'::JSONB,
  '123e4567-e89b-12d3-a456-426614174000'
);

INSERT INTO "music"."AlbumArtist" ("album_id", "artist_id") VALUES (
  (SELECT id FROM "music"."Album" WHERE name = 'Panoramic / Ambient'),
  (SELECT id FROM "music"."Artist" WHERE name = 'Podington Bear')
);

-- Black Ant / Free Beats Sel. 3
INSERT INTO "music"."Album" ("name", "release_date", "explicit", "type", "artwork", "media_file_id") VALUES (
  'Free Beats Sel. 3',
  '2010-01-25'::DATE,
  FALSE,
  'ALBUM',
  '{
    "url": "https://freemusicarchive.org/image/?file=images%2Falbums%2FBlack_Ant_-_Free_Beats_Sel_3_-_20100125165648429.JPG&width=290&height=290&type=album",
    "backgroundColor": "#000000",
    "textColor": "#FFFFFF"
  }'::JSONB,
  '123e4567-e89b-12d3-a456-426614174000'
);

INSERT INTO "music"."AlbumArtist" ("album_id", "artist_id") VALUES (
  (SELECT id FROM "music"."Album" WHERE name = 'Free Beats Sel. 3'),
  (SELECT id FROM "music"."Artist" WHERE name = 'Black Ant')
);
