import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core'

import { SoundCloudIcon } from '../soundcloud-icon/soundcloud-icon'
import { YoutubeIcon } from '../youtube-icon/youtube-icon'
import { DATA_SOURCES, provideDataSources } from '../../providers'

import { Chip } from '@/shared/components'

@Component({
  selector: 'n-import-source-chip',
  templateUrl: './import-source-chip.html',
  styleUrl: './import-source-chip.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Chip, YoutubeIcon, SoundCloudIcon],
  providers: [provideDataSources()],
})
export class ImportSourceChip {
  readonly dataSources = inject(DATA_SOURCES)

  readonly dataSource = input.required<string>()

  protected readonly label = computed(() => this.dataSources[this.dataSource()] ?? this.dataSource())
}
