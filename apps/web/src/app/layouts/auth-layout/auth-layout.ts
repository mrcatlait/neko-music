import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'

@Component({
  selector: 'n-auth-layout',
  imports: [RouterOutlet],
  template: `
    <div class="auth-layout">
      <aside class="auth-layout__sidebar">
        <h1>Neko Music</h1>
      </aside>
      <main class="auth-layout__content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [
    `
      @use 'abstracts' as abstracts;

      .auth-layout {
        height: 100%;
        max-height: 100%;
        display: grid;
        grid-template-columns: 21fr 34fr;

        @include abstracts.window-class(compact, medium) {
          grid-template-columns: 1fr;
          justify-content: center;
        }

        &__sidebar {
          @include abstracts.window-class(compact, medium) {
            display: none;
          }
        }

        &__content {
          max-width: 416px;
          align-self: center;
          justify-self: center;
          width: 100%;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLayout {}
