import { ChangeDetectionStrategy, Component, computed, inject, input, linkedSignal, output } from '@angular/core'

import { SoundCloudIcon, YoutubeIcon } from '../../../shared'

import { Button } from '@/shared/components'
import { GetImportMethodsGql } from '@/shared/generated-types'

@Component({
  selector: 'n-select-source-step',
  templateUrl: './select-source-step.html',
  styleUrl: './select-source-step.scss',
  imports: [Button, YoutubeIcon, SoundCloudIcon],
  providers: [GetImportMethodsGql],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectSourceStep {
  private readonly getImportMethodsGql = inject(GetImportMethodsGql)

  readonly selectedSource = input<string>('')
  readonly sourceSelected = output<string>()

  protected readonly source = linkedSignal(() => this.selectedSource())
  protected readonly importMethodsResource = this.getImportMethodsGql.graphqlResource({})
  protected readonly sources = computed(() => this.importMethodsResource.value()?.importMethods ?? [])

  protected selectSource(source: string) {
    this.source.set(source)
  }

  protected continue() {
    this.sourceSelected.emit(this.source())
  }
}
