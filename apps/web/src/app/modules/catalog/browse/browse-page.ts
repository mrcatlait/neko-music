import { ChangeDetectionStrategy, Component } from '@angular/core'

import { RecommendedMixes } from './recommended-mixes/recommended-mixes'

@Component({
  selector: 'n-browse-page',
  standalone: true,
  imports: [RecommendedMixes],
  templateUrl: './browse-page.html',
  styleUrl: './browse-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrowsePage {}
