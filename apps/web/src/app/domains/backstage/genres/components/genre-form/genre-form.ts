import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router } from '@angular/router'

import { Snackbar } from '@/shared/snackbar'
import { Button, LoadingIndicator, Textfield } from '@/shared/components'

@Component({
  selector: 'n-genre-form',
  templateUrl: './genre-form.html',
  styleUrl: './genre-form.scss',
  imports: [Button, LoadingIndicator, ReactiveFormsModule, Textfield],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenreForm {
  private readonly router = inject(Router)
  private readonly snackbar = inject(Snackbar)

  genreId = input<string>()

  protected readonly form = new FormGroup({
    name: new FormControl('', [Validators.required]),
  })

  protected readonly saving = signal(false)

  get name(): FormControl {
    return this.form.controls.name
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }

    const name = this.name.value

    this.snackbar.info('Genre created successfully')
    this.router.navigate(['/backstage/genres'])
  }
}
