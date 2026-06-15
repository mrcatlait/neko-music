import { ChangeDetectionStrategy, Component } from '@angular/core'

type RecommendedMixBackground =
  | { type: 'image'; imageUrl: string }
  | { type: 'illustration'; variant: 'rings' | 'marble' }

interface RecommendedMixCard {
  id: string
  caption: string
  title: string
  background: RecommendedMixBackground
}

@Component({
  selector: 'n-recommended-mixes',
  standalone: true,
  templateUrl: './recommended-mixes.html',
  styleUrl: './recommended-mixes.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommendedMixes {
  protected readonly cards: readonly RecommendedMixCard[] = [
    {
      id: 'youtube-mix',
      caption: 'Your mix',
      title: 'YouTube Mix',
      background: {
        type: 'illustration',
        variant: 'rings',
      },
    },
    {
      id: 'phonk-mix',
      caption: 'Phonk mix',
      title: 'LSXT CXNTURE',
      background: {
        type: 'image',
        imageUrl: 'https://images.unsplash.com/photo-1579546929662-711aa81148cf?auto=format&fit=crop&w=800&q=80',
      },
    },
    {
      id: 'night-drive',
      caption: 'Collection',
      title: 'Night Drive',
      background: {
        type: 'illustration',
        variant: 'marble',
      },
    },
  ]
}
