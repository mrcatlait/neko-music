import { NgModule } from '@angular/core'

import { LayoutMinimalComponent } from './layout-minimal.component'

import { SharedModule } from '@shared/shared.module'

@NgModule({
  imports: [SharedModule],
  declarations: [LayoutMinimalComponent],
  exports: [LayoutMinimalComponent],
})
export class LayoutMinimalModule {}
