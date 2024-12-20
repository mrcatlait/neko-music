import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'

import {
  CollectionMembershipOptionsDto,
  PlaylistPageOptionsDto,
  PlaylistPageDto,
  GetPlaylistDto,
  CreatePlaylistDto,
  CollectionMembershipPageDto,
  PlaylistDto,
  AddCollectionToPlaylistDto,
  UpdatePlaylistDto,
} from '../dto'
import {
  GetCollectionMembershipHandler,
  GetPlaylistHandler,
  GetUserPlaylistsHandler,
  GetPlaylistTracksHandler,
} from '../queries'
import { CreatePlaylistHandler, DeletePlaylistHandler, AddToPlaylistHandler, UpdatePlaylistHandler } from '../commands'

import { TracksPageDto } from '@modules/track/dtos'

@Controller('playlists')
@ApiTags('Playlists')
export class PlaylistController {
  constructor(
    private readonly getCollectionMembershipHandler: GetCollectionMembershipHandler,
    private readonly createPlaylistHandler: CreatePlaylistHandler,
    private readonly deletePlaylistHandler: DeletePlaylistHandler,
    private readonly getUserPlaylistsHandler: GetUserPlaylistsHandler,
    private readonly getPlaylistHandler: GetPlaylistHandler,
    private readonly addToPlaylistHandler: AddToPlaylistHandler,
    private readonly updatePlaylistHandler: UpdatePlaylistHandler,
    private readonly getPlaylistTracksHandler: GetPlaylistTracksHandler,
  ) {}

  @Get('me')
  @ApiOperation({
    summary: 'Get all playlists of the current user',
  })
  @ApiOkResponse({
    type: PlaylistPageDto,
  })
  getUserPlaylists(@Query() query: PlaylistPageOptionsDto): Promise<PlaylistPageDto> {
    return this.getUserPlaylistsHandler.handle({
      userId: '16eeafde-da3d-4b66-8c0a-ec3b086b3a3b',
      pageOptionsDto: query,
    })
  }

  @Get('me/collection-membership')
  @ApiOperation({
    summary: "Get the membership of a collection in the current user's playlists",
  })
  @ApiOkResponse({
    type: CollectionMembershipPageDto,
  })
  getCollectionMembership(@Query() query: CollectionMembershipOptionsDto): Promise<CollectionMembershipPageDto> {
    return this.getCollectionMembershipHandler.handle({
      userId: '16eeafde-da3d-4b66-8c0a-ec3b086b3a3b',
      collectionId: query.collectionId,
      collectionType: query.collectionType,
      pageOptionsDto: {
        offset: query.offset,
        take: query.take,
      },
    })
  }

  @Get(':playlistId')
  @ApiOperation({
    summary: 'Get a playlist by its ID',
  })
  @ApiOkResponse({
    type: PlaylistDto,
  })
  getPlaylistById(@Param() params: GetPlaylistDto): Promise<PlaylistDto> {
    return this.getPlaylistHandler.handle({
      playlistId: params.playlistId,
    })
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new playlist',
  })
  createPlaylist(@Body() body: CreatePlaylistDto) {
    return this.createPlaylistHandler.handle({
      userId: '16eeafde-da3d-4b66-8c0a-ec3b086b3a3b',
      name: body.name,
      description: body.description,
      type: body.type,
    })
  }

  @Delete(':playlistId')
  @ApiOperation({
    summary: 'Delete a playlist by its ID',
  })
  deletePlaylist(@Param() params: GetPlaylistDto): Promise<void> {
    return this.deletePlaylistHandler.handle({
      playlistId: params.playlistId,
    })
  }

  @Put(':playlistId')
  @ApiOperation({
    summary: 'Update a playlist by its ID',
  })
  updatePlaylist(@Param() params: GetPlaylistDto, @Body() body: UpdatePlaylistDto) {
    return this.updatePlaylistHandler.handle({
      playlistId: params.playlistId,
      userId: '16eeafde-da3d-4b66-8c0a-ec3b086b3a3b',
      name: body.name,
      description: body.description,
      type: body.type,
    })
  }

  @Get(':playlistId/tracks')
  @ApiOperation({
    summary: 'Get tracks by playlist',
  })
  @ApiOkResponse({
    type: TracksPageDto,
  })
  getPlaylistTracks(@Param() params: GetPlaylistDto): Promise<TracksPageDto> {
    return this.getPlaylistTracksHandler.handle({
      playlistId: params.playlistId,
    })
  }

  @Post(':playlistId/tracks')
  @ApiOperation({
    summary: 'Add tracks to a playlist',
  })
  addTracksToPlaylist(@Param() params: GetPlaylistDto, @Body() body: AddCollectionToPlaylistDto) {
    return this.addToPlaylistHandler.handle({
      playlistId: params.playlistId,
      collectionId: body.collectionId,
      collectionType: body.collectionType,
      userId: '16eeafde-da3d-4b66-8c0a-ec3b086b3a3b',
    })
  }

  @Delete(':playlistId/tracks')
  @ApiOperation({
    summary: 'Remove tracks from a playlist',
  })
  removeTracksFromPlaylist(@Param() params: GetPlaylistDto, @Body() body: any) {
    return []
  }

  @Put(':playlistId/tracks')
  @ApiOperation({
    summary: 'Update the order of tracks in a playlist',
  })
  reorderPlaylistTracks(@Param() params: GetPlaylistDto, @Body() body: any) {
    return []
  }
}
