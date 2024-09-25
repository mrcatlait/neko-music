import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'

import { ButtonDirective, SelectorDirective, SliderDirective, SlotDirective } from './directives'
import { AppBarComponent, LogoComponent, TrackMediaCardComponent } from './components'
import { ImageUrlPipe, NumberSequencePipe } from './pipes'

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  declarations: [
    AppBarComponent,
    ButtonDirective,
    ImageUrlPipe,
    LogoComponent,
    NumberSequencePipe,
    SelectorDirective,
    SliderDirective,
    SlotDirective,
    TrackMediaCardComponent,
  ],
  exports: [
    AppBarComponent,
    ButtonDirective,
    CommonModule,
    ImageUrlPipe,
    LogoComponent,
    NumberSequencePipe,
    ReactiveFormsModule,
    RouterModule,
    SelectorDirective,
    SliderDirective,
    SlotDirective,
    TrackMediaCardComponent,
  ],
})
export class SharedModule {}
