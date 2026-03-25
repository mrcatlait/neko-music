import { ChangeDetectionStrategy, Component, ElementRef, input, model, viewChild } from '@angular/core'
import { FormValueControl, ValidationError, WithOptionalFieldTree } from '@angular/forms/signals'

import { AUDIO_UPLOAD_CONFIG } from '../../constants'

@Component({
  selector: 'n-audio-file-upload',
  templateUrl: './audio-file-upload.html',
  styleUrl: './audio-file-upload.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AudioFileUpload implements FormValueControl<File | null> {
  private readonly fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput')

  readonly value = model<File | null>(null)
  readonly label = input<string>('Audio file')
  readonly errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([])
  readonly disabled = input(false)
  readonly invalid = input(false)
  readonly touched = model(false)

  protected readonly accept = AUDIO_UPLOAD_CONFIG.allowedTypes.join(',')

  protected onBrowse(): void {
    this.fileInput()?.nativeElement.click()
  }

  protected onSelected(event: Event): void {
    const inputEl = event.target as HTMLInputElement
    const file = inputEl.files?.[0] ?? null
    this.value.set(file)
    this.touched.set(true)
    inputEl.value = ''
  }

  protected fileName(): string {
    return this.value()?.name ?? ''
  }
}
