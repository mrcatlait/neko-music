# Import uses a two-phase workflow (Discovery -> Import Job)

Neko Music import is split into immutable discovery snapshots and execution jobs with a 1:1 mapping from job to discovery. We chose this to preserve user intent (select-then-start), support source drift via explicit refresh snapshots, and avoid accidental imports from implicit rediscovery.
