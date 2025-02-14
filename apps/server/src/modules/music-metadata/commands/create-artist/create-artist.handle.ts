import { Injectable } from '@nestjs/common'

import { CreateArtistCommand } from './create-artist.command'
import { ArtistRepository } from '../../repositories'
import { ArtistDto } from '../../dtos'

import { CommandHandler } from '@modules/shared/models'

@Injectable()
export class CreateArtistHandler implements CommandHandler<CreateArtistCommand, ArtistDto> {
  constructor(private readonly artistRepository: ArtistRepository) {}

  handle(command: CreateArtistCommand): Promise<ArtistDto> {
    return Promise.resolve({} as ArtistDto)
    // const artist = await this.artistRepository.create({
    //   name: command.name,
    //   bio: command.bio,
    //   image: command.image,
    // })

    // const artist = await this.artistRepository.getById(artist.id)

    // if (!artist) {
    //   throw new InternalServerErrorException()
    // }

    // return artist
  }
}
