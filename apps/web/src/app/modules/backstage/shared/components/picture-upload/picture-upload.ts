import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  model,
  signal,
  viewChild,
} from '@angular/core'
import { FormValueControl, ValidationError, WithOptionalFieldTree } from '@angular/forms/signals'

import { PICTURE_UPLOAD_CONFIG } from '../../constants'

@Component({
  selector: 'n-picture-upload',
  templateUrl: './picture-upload.html',
  styleUrl: './picture-upload.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PictureUpload implements FormValueControl<File | null> {
  private readonly fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput')

  readonly value = model<File | null>(null)
  readonly existingImageUrl = input<string | null>(null)
  readonly errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([])
  readonly disabled = input(false)
  readonly invalid = input(false)
  readonly touched = model(false)

  protected readonly dragging = signal(false)
  protected readonly previewUrl = computed<string>(() => {
    const file = this.value()

    if (file) return URL.createObjectURL(file)

    const existing = this.existingImageUrl()
    if (existing) return existing

    return './assets/images/placeholders/1x1.gif'
  })

  protected readonly allowedTypes = PICTURE_UPLOAD_CONFIG.allowedTypes

  protected onBrowseFiles(): void {
    this.safeFileInput.click()
  }

  protected onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement
    const file = fileInput.files?.[0]

    this.uploadFile(file)
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault()
    this.dragging.set(false)

    const files = event.dataTransfer?.files
    const file = files?.[0]

    this.uploadFile(file)
  }

  protected onDragover(event: DragEvent): void {
    event.preventDefault()
    this.dragging.set(true)
  }

  protected onDragleave(event: DragEvent): void {
    event.preventDefault()
    this.dragging.set(false)
  }

  private uploadFile(file?: File | null): void {
    this.value.set(file ?? null)
    this.touched.set(true)
  }

  private get safeFileInput(): HTMLInputElement {
    const fileInput = this.fileInput()?.nativeElement

    if (!fileInput) {
      throw new Error('File input not found')
    }

    return fileInput
  }
}
