import { ChangeDetectionStrategy, Component, input } from '@angular/core'

@Component({
  selector: 'neko-avatar',
  template: `
    @if (src()) {
      <img
        [alt]="alt()"
        [src]="src()"
        class="avatar"
      />
    } @else {
      <div class="avatar">
        <ng-content />
      </div>
    }
  `,
  styleUrl: './avatar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent {
  src = input<string>()
  alt = input<string>()
}
