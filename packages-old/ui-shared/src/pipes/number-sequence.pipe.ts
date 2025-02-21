import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'numberSequence',
})
export class NumberSequencePipe implements PipeTransform {
  transform(value: number): number[] {
    if (value < 0) {
      return []
    }

    return Array(value)
      .fill(0)
      .map((_, index) => index)
  }
}
