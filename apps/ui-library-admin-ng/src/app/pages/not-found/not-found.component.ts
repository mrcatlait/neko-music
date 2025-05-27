import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { ButtonDirective } from '@neko/ui-shared/directives'

@Component({
  standalone: true,
  selector: 'neko-not-found-page',
  imports: [ButtonDirective, RouterLink],
  templateUrl: 'not-found.component.html',
  styleUrl: 'not-found.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundPage {}
