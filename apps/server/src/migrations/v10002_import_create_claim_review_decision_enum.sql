CREATE TYPE "import"."ClaimReviewDecision" AS ENUM (
  'link_existing',
  'create_new',
  'ignore',
  'reject',
  'pending'
);

COMMENT ON TYPE "import"."ClaimReviewDecision" IS 'The review decision for a metadata claim';
