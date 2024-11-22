import { ScriptInterface } from '@common/services/types'
import { GenreRepository } from '@features/track/repositories'

export class v10_CreateGenres implements ScriptInterface {
  private readonly genres = [
    'Alternative',
    'Anime',
    'Blues',
    'Children',
    'Classical',
    'Commercial',
    'Country',
    'Dance',
    'Electronic',
    'Folk',
    'Hip-Hop',
    'Instrumental',
    'J-Pop',
    'Jazz',
    'K-Pop',
    'Latin',
    'Metal',
    'Opera',
    'Pop',
    'R&B and Soul',
    'Reggae',
    'Rock',
    'Soundtrack',
    // Languages
    'Russian',
    'Japanese',
  ]

  async up(): Promise<void> {
    for (const name of this.genres) {
      await GenreRepository.create({ name })
    }
  }

  async down(): Promise<void> {
    for (const name of this.genres) {
      await GenreRepository.deleteByName(name)
    }
  }
}
