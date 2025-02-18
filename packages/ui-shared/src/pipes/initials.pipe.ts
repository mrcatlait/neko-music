import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'initials',
})
export class InitialsPipe implements PipeTransform {
  transform(name?: string): string {
    if (!name) {
      return ''
    }

    const hasTokens = name.indexOf(' ') !== -1
    return name.substring(0, hasTokens ? 1 : 2) + (hasTokens ? name.charAt(name.lastIndexOf(' ') + 1) : '')
  }
}
