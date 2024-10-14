import { NgModule } from '@angular/core'
import { CommonModule, NgOptimizedImage } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'

import {
  ButtonDirective,
  DropdownTriggerDirective,
  SelectorDirective,
  SliderDirective,
  SlotDirective,
} from './directives'
import {
  AppBarComponent,
  LogoComponent,
  MediaCardComponent,
  MediaCardSubtitleDirective,
  MediaCardTitleDirective,
  MenuComponent,
  PlayIconComponent,
} from './components'
import { ImageUrlPipe, NumberSequencePipe } from './pipes'

@NgModule({
  imports: [CommonModule, NgOptimizedImage, ReactiveFormsModule, RouterModule],
  declarations: [
    AppBarComponent,
    ButtonDirective,
    DropdownTriggerDirective,
    ImageUrlPipe,
    LogoComponent,
    MediaCardComponent,
    MediaCardSubtitleDirective,
    MediaCardTitleDirective,
    MenuComponent,
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
    DropdownTriggerDirective,
    ImageUrlPipe,
    LogoComponent,
    MediaCardComponent,
    MediaCardSubtitleDirective,
    MediaCardTitleDirective,
    MenuComponent,
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
