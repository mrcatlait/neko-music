import { Injectable, inject } from '@angular/core'
import { Meta, Title } from '@angular/platform-browser'

import { environment } from '@environment'

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private readonly title = inject(Title)
  private readonly metaTagService = inject(Meta)

  setTitle(title?: string): void {
    if (!title) {
      this.title.setTitle(environment.applicationName)
    } else {
      this.title.setTitle(`${title} - ${environment.applicationName}`)
    }
  }

  resetTitle(): void {
    this.setTitle()
  }

  setDocumentDescription(description: string): void {
    this.metaTagService.updateTag({ name: 'description', content: description })
  }

  // Twitter metadata
  // this.meta.addTag({name: 'twitter:card', content: 'summary'});
  // this.meta.addTag({name: 'twitter:site', content: '@AngularUniv'});
  // this.meta.addTag({name: 'twitter:title', content: this.course.description});
  // this.meta.addTag({name: 'twitter:description', content: this.course.description});
  // this.meta.addTag({name: 'twitter:text:description', content: this.course.description});
  // this.meta.addTag({name: 'twitter:image', content: 'https://avatars3.githubusercontent.com/u/16628445?v=3&s=200'})
}
