For your platform, I would design the import UX as a **multi-screen workflow + long-lived import workspace**, rather than a wizard that tries to do everything in one session.

The key principle:

> Discovery is interactive. Analysis is asynchronous. Review is editorial.

---

# Screen 1 — Imports Overview

Purpose:

* Entry point
* Historical imports
* Progress monitoring

Route:

```plaintext
/backstage/imports
```

Layout:

```plaintext
┌─────────────────────────────────────┐
│ Imports                     [+Import]│
├─────────────────────────────────────┤
│ YouTube Playlist - Workout Mix      │
│ Processing • 248 tracks             │
│ 180 Ready • 12 Review • 2 Failed    │
├─────────────────────────────────────┤
│ Local Folder - NAS Music            │
│ Completed • 532 tracks              │
├─────────────────────────────────────┤
│ YouTube Track - Numb                │
│ Published • 1 track                 │
└─────────────────────────────────────┘
```

Actions:

* Create import
* Open import
* Retry failed
* Archive import
* Delete import

---

# Screen 2 — Select Import Source

Route:

```plaintext
/backstage/imports/new
```

Layout:

```plaintext
┌─────────────────────────────────────┐
│ Import Music                        │
├─────────────────────────────────────┤
│ Source Type                         │
│                                     │
│ ○ YouTube Track                     │
│ ○ YouTube Playlist                  │
│ ○ Local Folder                      │
│ ○ Upload Files                      │
│ ○ S3 Bucket                         │
│                                     │
│                     [Continue]      │
└─────────────────────────────────────┘
```

Future-proof:

Source types come from:

```http
GET /import-methods
```

allowing future providers.

---

# Screen 3 — Configure Source

Dynamic form based on source.

Example: YouTube Playlist

```plaintext
┌─────────────────────────────────────┐
│ Configure Import                    │
├─────────────────────────────────────┤
│ Playlist URL                        │
│ [___________________________]       │
│                                     │
│ Name                                │
│ Workout Mix                         │
│                                     │
│ [Discover Tracks]                   │
└─────────────────────────────────────┘
```

Example: Folder

```plaintext
Path
/media/music
```

Example: S3

```plaintext
Bucket
Prefix
Region
```

---

# Screen 4 — Discovery Results

Purpose:

* Verify source
* Select tracks

Route:

```plaintext
/backstage/imports/discovery/:id
```

Layout:

```plaintext
Found 248 tracks

☑ Select All

┌─────────────────────────────────────┐
│ ☑ Numb                              │
│ Linkin Park                         │
├─────────────────────────────────────┤
│ ☑ In The End                        │
│ Linkin Park                         │
├─────────────────────────────────────┤
│ ☑ Crawling                          │
│ Linkin Park                         │
└─────────────────────────────────────┘
```

Bulk actions:

```plaintext
Select All
Deselect All
Filter
Search
```

Footer:

```plaintext
248 selected

[Start Import]
```

Important:

No metadata analysis yet.

Discovery should remain fast.

---

# Screen 5 — Import Created

Immediately after user starts import.

Route:

```plaintext
/backstage/imports/:id
```

This becomes the central workspace.

---

Layout

Header:

```plaintext
Workout Mix

Source:
YouTube Playlist

248 Tracks

Status:
Processing
```

---

Summary Cards

```plaintext
Ready            180
Needs Review      12
Analyzing         40
Failed             2
```

---

Progress

```plaintext
███████████░░░░░░░░
72%
```

---

Tabs

```plaintext
Overview
Tracks
Review
Activity
```

---

# Screen 6 — Tracks Tab

Purpose:
Track-level visibility.

```plaintext
Track                     Status

Numb                      Ready
In The End                Ready
Breaking The Habit        Reviewing
Track X                   Failed
```

Filters:

```plaintext
All
Ready
Analyzing
Needs Review
Failed
```

---

Statuses

```plaintext
Queued
Analyzing
Ready
Needs Review
Failed
Published
```

Avoid technical terminology.

---

# Screen 7 — Review Queue

Most important screen.

Route:

```plaintext
/backstage/imports/:id/review
```

Shows only problematic tracks.

---

Layout

```plaintext
Needs Review (12)

Track A
Track B
Track C
```

Selecting a track opens metadata review.

---

# Screen 8 — Track Review Screen

Purpose:
Resolve metadata claims.

Layout:

```plaintext
Track:
Numb

Source:
YouTube
```

---

Metadata Claims Section

```plaintext
Artist
────────────────────

Suggested:
Linkin Park

Confidence:
92%

✓ Accept

✎ Change
```

---

Album

```plaintext
Suggested:
Meteora

Confidence:
78%

⚠ Similar Albums Found

Accept
Choose Different
Create New
```

---

Genre

```plaintext
Rock
Alternative Rock

Confidence:
64%
```

Actions:

```plaintext
Accept
Replace
Create New
```

---

Artwork

```plaintext
Found Artwork

Accept
Replace
Remove
```

---

Footer

```plaintext
[Approve Track]
```

---

# Screen 9 — Bulk Review

Extremely important.

Example:

```plaintext
50 tracks

Artist:
"Linkin park"
```

System groups issues.

Layout:

```plaintext
Potential Artist Match

Detected:
Linkin park

Suggested:
Linkin Park

Affected Tracks:
50

[Apply To All]
```

Without this screen large imports become painful.

---

# Screen 10 — Duplicate Resolution

Separate workflow.

```plaintext
Potential Duplicate

Existing:
Numb

Imported:
Numb

Confidence:
96%
```

Actions:

```plaintext
Skip
Import Anyway
Replace Existing
```

Bulk actions supported.

---

# Screen 11 — Ready For Publishing

When analysis completes.

```plaintext
248 Tracks

Ready:
236

Review:
0

Failed:
12
```

Actions:

```plaintext
Publish All Ready
Publish Selected
```

---

# Screen 12 — Publishing Progress

```plaintext
Publishing

Tracks:
236

███████████░░░░░░
72%
```

Publishing may trigger:

* media download
* DASH generation
* artwork processing

---

# Screen 13 — Import Activity Log

Useful for debugging.

```plaintext
12:01 Import created

12:03 Discovery completed

12:07 Metadata extracted

12:09 Artist matched

12:12 Publishing started
```

Advanced users love this.

---

# Recommended Navigation

```plaintext
Backstage
├── Imports
├── Review Queue
├── Tracks
├── Albums
├── Artists
└── Publishing
```

Notice that **Imports** and **Review Queue** are first-class concepts, not hidden inside Tracks.

---

# Material 3 Notes

For the screens you've shown previously:

Use elevated surfaces only for major content sections:

```plaintext
Import Summary Card
Review Card
Bulk Action Panel
```

Do **not** wrap every input in its own elevated card.

Recommended hierarchy:

```plaintext
Page
 ├─ Filled container (summary)
 ├─ Data table
 └─ Side panel/details
```

This will feel much closer to modern Material 3 admin tools and scale well when imports contain hundreds or thousands of tracks.
