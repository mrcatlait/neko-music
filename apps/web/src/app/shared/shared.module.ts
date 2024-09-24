import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'

import { ButtonDirective, SliderDirective, SlotDirective } from './directives'
import { AppBarComponent, LogoComponent } from './components'

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  declarations: [AppBarComponent, ButtonDirective, LogoComponent, SliderDirective, SlotDirective],
  exports: [
    AppBarComponent,
    ButtonDirective,
    CommonModule,
    LogoComponent,
    ReactiveFormsModule,
    RouterModule,
    SliderDirective,
    SlotDirective,
  ],
})
export class SharedModule {}
