import { ChangeDetectionStrategy, Component, computed, input, linkedSignal, output } from '@angular/core'

import { Button, Textfield } from '@/shared/components'

interface DiscoveryConfig {
  dataSource: string
  sourceRef: string
}

@Component({
  selector: 'n-configure-import-step',
  templateUrl: './configure-import-step.html',
  styleUrl: './configure-import-step.scss',
  imports: [Button, Textfield],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigureImportStep {
  readonly source = input.required<string>()
  readonly sourceRef = input<string>('')

  readonly navigateBack = output<void>()
  readonly importConfigured = output<DiscoveryConfig>()

  protected readonly sourceInput = linkedSignal(() => this.sourceRef())
  protected readonly sourceRefError = computed(() => {
    const sourceValue = this.sourceInput().trim()

    if (!sourceValue) {
      return 'Source reference is required'
    }

    if (this.source() === 'youtube') {
      const youtubeUrlPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/

      if (!youtubeUrlPattern.test(sourceValue)) {
        return 'Invalid YouTube URL'
      }
    }

    return ''
  })

  protected continue() {
    if (this.sourceRefError()) {
      return
    }

    this.importConfigured.emit({
      dataSource: this.source(),
      sourceRef: this.sourceInput().trim(),
    })
  }

  protected previous() {
    this.navigateBack.emit()
  }
}
