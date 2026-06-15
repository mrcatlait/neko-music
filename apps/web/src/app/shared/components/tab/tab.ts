import { ChangeDetectionStrategy, Component, TemplateRef, input, viewChild } from '@angular/core'

@Component({
  selector: 'n-tab',
  template: `
    <ng-template>
      <ng-content />
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tab {
  readonly label = input.required<string>()
  readonly count = input<number | null>(null)

  readonly content = viewChild.required<TemplateRef<unknown>>(TemplateRef)
}
