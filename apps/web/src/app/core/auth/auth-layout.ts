import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'

@Component({
  selector: 'n-auth-layout',
  imports: [RouterOutlet],
  template: `
    <div class="auth-layout">
      <aside class="auth-layout__sidebar">
        <div class="auth-layout__brand">
          <p class="label-large auth-layout__eyebrow">Neko Music</p>
          <h1 class="display-medium auth-layout__title">Own your music library</h1>
          <p class="body-large auth-layout__description">
            Stream your local collection with a modern, private-first experience that stays fully under your control.
          </p>
        </div>

        <ul class="auth-layout__highlights body-medium">
          <li>Self-hosted and privacy focused</li>
          <li>Built for collectors and audiophiles</li>
          <li>Simple workflows that scale with your library</li>
        </ul>
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
        min-height: 100%;
        max-height: 100%;
        display: grid;
        grid-template-columns: 38.2% 61.8%;
        background: linear-gradient(
          120deg,
          color-mix(in oklab, var(--color-surface-container), var(--color-primary) 14%) 0%,
          var(--color-surface) 54%
        );

        @include abstracts.window-class(compact, medium) {
          grid-template-columns: 1fr;
          background: var(--color-surface);
        }

        &__sidebar {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 32px;
          padding: 56px;
          color: var(--color-on-surface);

          @include abstracts.window-class(compact, medium) {
            display: none;
          }
        }

        &__brand {
          display: flex;
          flex-direction: column;
          gap: 20px;
          max-width: 520px;
        }

        &__eyebrow {
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--color-primary);
        }

        &__title {
          margin: 0;
          max-width: 14ch;
        }

        &__description {
          margin: 0;
          max-width: 44ch;
          color: var(--color-text-medium-emphasis);
        }

        &__highlights {
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
          list-style: none;
          color: var(--color-text-medium-emphasis);

          li {
            position: relative;
            padding-left: 20px;

            &::before {
              content: '';
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background-color: var(--color-primary);
              position: absolute;
              left: 0;
              top: 0.5em;
              transform: translateY(-50%);
            }
          }
        }

        &__content {
          width: min(100%, 440px);
          align-self: center;
          justify-self: center;
          padding: 40px 20px;
        }

        @include abstracts.window-class(expanded, large) {
          &__content {
            padding: 56px 40px;
          }
        }

        @include abstracts.window-class(compact, medium) {
          &__content {
            width: min(100%, 416px);
            padding: 24px;
          }
        }

        @include abstracts.window-class(compact) {
          &__content {
            width: 100%;
            padding: 16px;
          }
        }
      }

      :host {
        height: 100%;
        display: block;

        @include abstracts.window-class(compact, medium) {
          overflow-y: auto;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLayout {}
