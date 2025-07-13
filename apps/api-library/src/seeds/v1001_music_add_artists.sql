TRUNCATE TABLE "music"."Artist" CASCADE;

INSERT INTO "music"."Artist" ("name", "verified", "artwork", "metadata") VALUES (
  'Podington Bear',
  TRUE,
  '{
    "url": "https://freemusicarchive.org/image/?file=images%2Fartists%2FPodington_Bear_-_20100419190435595.jpg&width=290&height=290&type=artist",
    "background_color": "#2C1810",
    "text_color": "#F5F5DC"
  }'::JSONB,
  '{
    "editorial_notes": {
      "short": "A mysterious bear named Podington took the Internet by storm in 2007, releasing three beautifully crafted songs a week.",
      "standard": "A mysterious bear named Podington took the Internet by storm in 2007, releasing three beautifully crafted songs a week. Podington`s podcast rubbed shoulders with KEXP`s Song of the Day and NPR`s All Songs Considered atop the the iTunes charts, while his story captivated Morning Edition, The Globe and Mail, Wired.com`s Listening Post, and and dozens of influential music blogs. The experiment inspired countless new works of art, and translated into commercial success."
    }
  }'::JSONB
);

INSERT INTO "music"."Artist" ("name", "verified", "artwork", "metadata") VALUES (
  'Black Ant',
  TRUE,
  '{
    "url": "https://freemusicarchive.org/image/?file=images%2Fartists%2FBlack_Ant_-_20100815203310658.png&width=290&height=290&type=artist",
    "background_color": "#2C1810",
    "text_color": "#F5F5DC"
  }'::JSONB,
  '{
    "editorial_notes": {
      "short": "Black Ant is an as-of-now-still-in-high-school beatmaker from Hollywood, Florida. He specializes in a unique style of bassy often-distorted space hip hop although he is not afraid to bring the slick jazzy stuff when that needs to be brought",
      "standard": "Black Ant is an as-of-now-still-in-high-school beatmaker from Hollywood, Florida. He specializes in a unique style of bassy often-distorted space hip hop although he is not afraid to bring the slick jazzy stuff when that needs to be brought"
    }
  }'::JSONB
);
