import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'

import { PlaylistCreateState } from './playlist-create.state'

import { SharedModule } from '@shared/shared.module'

@Component({
  standalone: true,
  selector: 'neko-playlist-create',
  templateUrl: 'playlist-create.component.html',
  styleUrl: 'playlist-create.component.scss',
  imports: [SharedModule],
  providers: [PlaylistCreateState],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaylistCreateComponent {
  readonly state = inject(PlaylistCreateState)

  readonly loading = this.state.loading
  readonly error = this.state.error

  readonly form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    isPublic: new FormControl(false),
  })

  handleSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }

    const name = this.form.controls.name.value ?? ''
    const description = this.form.controls.description.value ?? ''
    const isPublic = this.form.controls.isPublic.value ?? false

    this.state.create({ name, description, isPublic })
  }
}
