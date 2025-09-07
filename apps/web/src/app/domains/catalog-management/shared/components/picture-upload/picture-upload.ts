import { ChangeDetectionStrategy, Component, ElementRef, signal, viewChild } from '@angular/core'

@Component({
  selector: 'n-picture-upload',
  templateUrl: './picture-upload.html',
  styleUrl: './picture-upload.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PictureUpload {
  private readonly fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput')

  protected readonly maxFileSize = 10 * 1024 * 1024 // 10MB
  protected readonly allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

  protected readonly dragging = signal(false)
  protected readonly previewUrl = signal<string | null>(null)
  protected readonly error = signal<string | null>(null)

  protected onBrowseFiles(): void {
    this.fileInput()?.nativeElement.click()
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

  private uploadFile(file?: File): void {
    if (!file) {
      this.error.set('No file selected')
      return
    }

    this.error.set(null)

    const validationError = this.validate(file)

    if (validationError) {
      this.error.set(validationError)
      return
    }

    try {
      const url = URL.createObjectURL(file)
      this.previewUrl.set(url)
    } catch {
      this.error.set('Failed to create image preview')
    }
  }

  private validate(file: File): string | null {
    if (!this.allowedTypes.includes(file.type)) {
      return 'Only JPEG, PNG, and WEBP files are allowed'
    }

    if (file.size > this.maxFileSize) {
      return 'File size must be less than 10MB'
    }

    return null
  }

  private get safeFileInput(): HTMLInputElement {
    const fileInput = this.fileInput()?.nativeElement

    if (!fileInput) {
      throw new Error('File input not found')
    }

    return fileInput
  }
}
