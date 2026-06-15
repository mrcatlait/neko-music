import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { form, FormField, FormRoot, required, validate } from '@angular/forms/signals'

import { Textfield } from '@/shared/components'

interface ConfigureYoutubeImportModel {
  youtubeUrl: string
}

@Component({
  selector: 'n-configure-youtube-import',
  templateUrl: './configure-youtube-import.html',
  styleUrl: './configure-youtube-import.scss',
  imports: [FormRoot, Textfield, FormField],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigureYoutubeImport {
  private readonly configureYoutubeImportModel = signal<ConfigureYoutubeImportModel>({
    youtubeUrl: '',
  })

  protected readonly configureYoutubeImportForm = form(
    this.configureYoutubeImportModel,
    (schemaPath) => {
      required(schemaPath.youtubeUrl, { message: 'YouTube URL is required' })
      validate(schemaPath.youtubeUrl, ({ value }) => {
        const youtubeUrlPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/

        if (!value()) {
          return null
        }

        if (!youtubeUrlPattern.test(value())) {
          return { kind: 'youtubeUrl', message: 'Invalid YouTube URL' }
        }

        return null
      })
    },
    {
      submission: {
        action: async (formRoot) => {
          const configureYoutubeImport = formRoot().value()
          // return this.configureYoutubeImport(configureYoutubeImport)
        },
        onInvalid: (formRoot) => {
          formRoot.youtubeUrl().markAsTouched()
          formRoot().errorSummary()[0]?.fieldTree().focusBoundControl()
        },
      },
    },
  )
}
