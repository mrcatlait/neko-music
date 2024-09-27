import { NgModule } from '@angular/core'
import { CommonModule, NgOptimizedImage } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'

import { ButtonDirective, SelectorDirective, SliderDirective, SlotDirective } from './directives'
import {
  AppBarComponent,
  LogoComponent,
  MediaCardComponent,
  MediaCardSubtitleDirective,
  MediaCardTitleDirective,
  PlayIconComponent,
} from './components'
import { ImageUrlPipe, NumberSequencePipe } from './pipes'

@NgModule({
  imports: [CommonModule, NgOptimizedImage, ReactiveFormsModule, RouterModule],
  declarations: [
    AppBarComponent,
    ButtonDirective,
    ImageUrlPipe,
    LogoComponent,
    MediaCardComponent,
    MediaCardSubtitleDirective,
    MediaCardTitleDirective,
    NumberSequencePipe,
    PlayIconComponent,
    SelectorDirective,
    SliderDirective,
    SlotDirective,
  ],
  exports: [
    AppBarComponent,
    ButtonDirective,
    CommonModule,
    ImageUrlPipe,
    LogoComponent,
    MediaCardComponent,
    MediaCardSubtitleDirective,
    MediaCardTitleDirective,
    NgOptimizedImage,
    NumberSequencePipe,
    PlayIconComponent,
    ReactiveFormsModule,
    RouterModule,
    SelectorDirective,
    SliderDirective,
    SlotDirective,
  ],
})
export class SharedModule {}
