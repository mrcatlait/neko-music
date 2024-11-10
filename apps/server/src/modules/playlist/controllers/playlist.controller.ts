import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put } from '@nestjs/common'
import { ApiTags, ApiOkResponse, ApiCreatedResponse, ApiBearerAuth } from '@nestjs/swagger'

import {
  AddPlaylistTrackDto,
  CreatePlaylistDto,
  PlaylistDto,
  PlaylistPageDto,
  RemovePlaylistTrackDto,
  UpdatePlaylistDto,
} from '../dto'
import { PlaylistService } from '../services'
import { UpdatePlaylistTracksDto } from '../dto/update-playlist-tracks.dto'

import { UserAccountEntity } from '@modules/user/entities'
import { User } from '@modules/authorization/decorators'
import { UserModel } from '@modules/authorization/models'

@Controller('playlists')
@ApiTags('Playlists')
@ApiBearerAuth()
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Get('/me')
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: PlaylistPageDto,
  })
  userPlaylists(@User() user: UserAccountEntity): Promise<PlaylistPageDto> {
    return this.playlistService.getPlaylists(user, { offset: 0, take: 50 })
  }

  @Get('/:playlistId')
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: PlaylistDto,
  })
  getPlaylistById(@Param('playlistId') playlistId: string): Promise<PlaylistDto> {
    return this.playlistService.searchPlaylist(playlistId)
  }

  @Post()
  @ApiCreatedResponse({
    status: HttpStatus.CREATED,
  })
  createPlaylist(@User() user: UserModel, @Body() input: CreatePlaylistDto): Promise<PlaylistDto> {
    return this.playlistService.createPlaylist(user, input)
  }

  @Delete('/:playlistId')
  @ApiCreatedResponse({
    status: HttpStatus.OK,
  })
  deletePlaylist(@User() user: UserModel, @Param('playlistId') playlistId: string): Promise<void> {
    return this.playlistService.deletePlaylist(user, playlistId)
  }

  @Put('/:playlistId')
  @ApiCreatedResponse({
    status: HttpStatus.OK,
  })
  updatePlaylist(
    @User() user: UserModel,
    @Param('playlistId') playlistId: string,
    @Body() input: UpdatePlaylistDto,
  ): Promise<void> {
    return this.playlistService.updatePlaylist(user, playlistId, input)
  }

  @Post('/:playlistId/tracks')
  @ApiCreatedResponse({
    status: HttpStatus.OK,
  })
  addTracksToPlaylist(
    @User() user: UserModel,
    @Param('playlistId') playlistId: string,
    @Body() input: AddPlaylistTrackDto,
  ): Promise<void> {
    return this.playlistService.addTracksToPlaylist(user, playlistId, input)
  }

  @Delete('/:playlistId/tracks')
  @ApiCreatedResponse({
    status: HttpStatus.OK,
  })
  removeTracksFromPlaylist(
    @User() user: UserModel,
    @Param('playlistId') playlistId: string,
    @Body() input: RemovePlaylistTrackDto,
  ): Promise<void> {
    return this.playlistService.removeTracksFromPlaylist(user, playlistId, input)
  }

  @Put('/:playlistId/tracks')
  @ApiCreatedResponse({
    status: HttpStatus.OK,
  })
  updateTracksInPlaylist(
    @User() user: UserModel,
    @Param('playlistId') playlistId: string,
    @Body() input: UpdatePlaylistTracksDto,
  ): Promise<void> {
    return this.playlistService.updateTracksInPlaylist(user, playlistId, input)
  }
}
