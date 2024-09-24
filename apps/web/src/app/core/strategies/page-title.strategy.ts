import { Injectable } from '@angular/core'
import { TitleStrategy } from '@angular/router'

@Injectable()
export class PageTitleStrategy extends TitleStrategy {
  override updateTitle() {
    // Do noting
    return
  }
}
