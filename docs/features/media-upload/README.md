# Media Upload

## Overview
This document describes the media upload process flow and implementation details.

## Key Functionality
- **Media Upload**: Upload media files to the server
- **Media Validation**: Validate media files

## Process Flow
The media upload process follows this sequence:

```mermaid
sequenceDiagram
  actor User as User (Authorized)
  participant UI as UI
  participant MusicMetadataService as Music Metadata Service
  participant MediaService as Media Service

  User ->> UI: Upload artist photo
  UI ->> MusicMetadataService: POST /artists/{artistId}/images (/w user token)
  MusicMetadataService ->> MusicMetadataService: Validate user access
  MusicMetadataService ->> MusicMetadataService: Generate service token
  MusicMetadataService ->> MediaService: GET /media-token (/w service token)
  MediaService ->> MediaService: Validate service token
  MediaService ->> MusicMetadataService: Media token based on entity type and ID
  MusicMetadataService ->> UI: Media token based on entity type and ID
  UI ->> UI: Display upload form
  User ->> UI: Upload file
  UI ->> MediaService: POST /upload (/w media token and user token)
  MediaService ->> MediaService: Validate media token
  MediaService ->> MediaService: Save file
  MediaService ->> UI: Confirm upload
```

## Process Steps


## Error Handling
- File size limits
- Invalid file types
- Storage failures