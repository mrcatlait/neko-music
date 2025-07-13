TRUNCATE TABLE "music"."Album" CASCADE;
TRUNCATE TABLE "music"."AlbumArtist" CASCADE;

-- Podington Bear / Solo Instruments
INSERT INTO "music"."Album" ("title", "release_date", "explicit", "type", "artwork", "metadata") VALUES (
  'Solo Instruments',
  '2013-04-03'::DATE,
  FALSE,
  'ALBUM',
  '{
    "url": "https://freemusicarchive.org/image/?file=images%2Falbums%2FPodington_Bear_-_Solo_Instruments_-_20140411174826786.jpg&width=290&height=290&type=album",
    "background_color": "#000000",
    "text_color": "#FFFFFF"
  }'::JSONB,
  '{
    "editorial_notes": {
      "short": "This collection features tender, reflective, and spare solo compositions for piano, Rhodes electric piano, Wurlitzer electric piano, and celeste.",
      "standard": "This collection features tender, reflective, and spare solo compositions for piano, Rhodes electric piano, Wurlitzer electric piano, and celeste."
    }
  }'::JSONB
);

INSERT INTO "music"."AlbumArtist" ("album_id", "artist_id", "role") VALUES (
  (SELECT id FROM "music"."Album" WHERE title = 'Solo Instruments'),
  (SELECT id FROM "music"."Artist" WHERE name = 'Podington Bear'),
  'PRIMARY_ARTIST'
);

-- Podington Bear / Panoramic / Ambient
INSERT INTO "music"."Album" ("title", "release_date", "explicit", "type", "artwork", "metadata") VALUES (
  'Panoramic / Ambient',
  '2013-04-04'::DATE,
  FALSE,
  'ALBUM',
  '{
    "url": "https://freemusicarchive.org/image/?file=images%2Falbums%2FPodington_Bear_-_Panoramic__Ambient_-_20140411174347914.jpg&width=290&height=290&type=album",
    "background_color": "#000000",
    "text_color": "#FFFFFF"
  }'::JSONB,
  '{
    "editorial_notes": {
      "short": "An ambient collection with subtle use of drifting melodies.  Arrangements pulse with warmth, texture and detail.",
      "standard": "An ambient collection with subtle use of drifting melodies.  Arrangements pulse with warmth, texture and detail."
    }
  }'::JSONB
);

INSERT INTO "music"."AlbumArtist" ("album_id", "artist_id", "role") VALUES (
  (SELECT id FROM "music"."Album" WHERE title = 'Panoramic / Ambient'),
  (SELECT id FROM "music"."Artist" WHERE name = 'Podington Bear'),
  'PRIMARY_ARTIST'
);

-- Black Ant / Free Beats Sel. 3
INSERT INTO "music"."Album" ("title", "release_date", "explicit", "type", "artwork", "metadata") VALUES (
  'Free Beats Sel. 3',
  '2010-01-25'::DATE,
  FALSE,
  'ALBUM',
  '{
    "url": "https://freemusicarchive.org/image/?file=images%2Falbums%2FBlack_Ant_-_Free_Beats_Sel_3_-_20100125165648429.JPG&width=290&height=290&type=album",
    "background_color": "#000000",
    "text_color": "#FFFFFF"
  }'::JSONB,
  '{}'::JSONB
);

INSERT INTO "music"."AlbumArtist" ("album_id", "artist_id", "role") VALUES (
  (SELECT id FROM "music"."Album" WHERE title = 'Free Beats Sel. 3'),
  (SELECT id FROM "music"."Artist" WHERE name = 'Black Ant'),
  'PRIMARY_ARTIST'
);
