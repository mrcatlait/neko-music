import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core'

@Component({
  selector: 'n-avatar',
  template: `
    <div class="avatar">
      <div class="avatar__initials body-large">
        {{ initials() }}
      </div>
    </div>
  `,
  styles: [
    `
      .avatar {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;

        &__initials {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background-color: var(--color-secondary-container);
          color: var(--color-on-secondary-container);
          border-radius: var(--shape-corner-full);
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Avatar {
  displayName = input.required<string>()

  protected readonly initials = computed(() => {
    return this.displayName()
      .split(' ')
      .map((name) => name[0])
      .join('')
  })
}
