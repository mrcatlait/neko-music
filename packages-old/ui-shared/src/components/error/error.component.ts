import { Component, ChangeDetectionStrategy, input, computed, inject, OnInit, signal, OnDestroy } from '@angular/core'
import { AbstractControl, FormGroupDirective, ValidationErrors } from '@angular/forms'
import { merge, Subject, takeUntil } from 'rxjs'
import { VALIDATION_ERRORS } from '../../providers'

@Component({
  selector: 'neko-error',
  template: `{{ message() }}`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorComponent implements OnInit, OnDestroy {
  private readonly validationErrors = inject(VALIDATION_ERRORS)
  private readonly formGroupDirective = inject(FormGroupDirective)

  readonly control = input.required<AbstractControl>()

  private readonly destroyed$ = new Subject<void>()

  private readonly errors = signal<ValidationErrors | null>(null)

  private readonly touched = signal(false)

  readonly message = computed(() => this.getErrorMessage())

  ngOnInit(): void {
    if (!this.formGroupDirective) {
      throw new Error('ErrorComponent must be used within a FormGroupDirective')
    }

    const control = this.control()

    merge(control.events, this.formGroupDirective.ngSubmit)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.errors.set(control.errors)
        this.touched.set(control.touched)
      })
  }

  ngOnDestroy(): void {
    this.destroyed$.next()
    this.destroyed$.unsubscribe()
  }

  private getErrorMessage(): string {
    const errors = this.errors()

    if (!errors) {
      return ''
    }

    if (!this.touched()) {
      return ''
    }

    const firstKey = Object.keys(errors)[0]

    const messageTemplate = this.validationErrors[firstKey] as (typeof this.validationErrors)[string] | null

    if (!messageTemplate) {
      throw new Error(`No error message found for "${firstKey}" validation error`)
    }

    const messageData = {
      ...errors[firstKey],
    }

    return messageTemplate(messageData)
  }
}
