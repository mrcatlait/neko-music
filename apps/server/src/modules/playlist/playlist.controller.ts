import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common'
import { ApiTags, ApiOkResponse, ApiCreatedResponse, ApiBearerAuth } from '@nestjs/swagger'

import { CreatePlaylistDto, PlaylistDto, PlaylistPageDto } from './dto'
import { PlaylistService } from './playlist.service'

import { UserAccountEntity } from '@modules/user/entities'
import { User } from '@modules/authorization/decorators'
import { UserModel } from '@modules/authorization/models'

@Controller('playlists')
@ApiTags('Playlists')
@ApiBearerAuth()
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Get('/my')
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
    status: HttpStatus.OK,
    type: PlaylistDto,
  })
  createPlaylist(@User() user: UserModel, @Body() input: CreatePlaylistDto): Promise<PlaylistDto> {
    return this.playlistService.createPlaylist(user, input)
  }

  // @Put('/:playlistId')
  // @ApiCreatedResponse({
  //   status: HttpStatus.OK,
  //   type: PlaylistDto,
  // })
  // updatePlaylist(@Param('playlistId') playlistId: string, @Body() input: UpdatePlaylistDto): Promise<void> {
  //   return this.playlistService.updatePlaylist(playlistId, input)
  // }
}
