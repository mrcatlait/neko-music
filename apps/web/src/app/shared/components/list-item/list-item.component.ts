import { ChangeDetectionStrategy, Component, input } from '@angular/core'

@Component({
  selector: 'neko-list-item',
  templateUrl: 'list-item.component.html',
  styleUrl: 'list-item.component.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListItemComponent {
  readonly headline = input.required<string>()
  readonly supportingText = input<string>()
  readonly media = input.required<string>()
}
