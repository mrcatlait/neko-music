import { Signal } from '@angular/core'

export type StateModel<Type> = {
  readonly [Key in keyof Type]: Signal<Type[Key]>
}
