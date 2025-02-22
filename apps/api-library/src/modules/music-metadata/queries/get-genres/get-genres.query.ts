import { Query } from '@nestjs/cqrs'

import { GenreEntity } from '@modules/music-metadata/entities'

export class GetGenresQuery extends Query<GenreEntity[]> {}
