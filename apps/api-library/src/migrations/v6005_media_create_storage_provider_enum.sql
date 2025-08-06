CREATE TYPE "media"."StorageProvider" AS ENUM (
  'S3',
  'LOCAL',
  'CLOUDINARY',
  'AZURE'
);

COMMENT ON TYPE "media"."StorageProvider" IS 'The storage provider';
