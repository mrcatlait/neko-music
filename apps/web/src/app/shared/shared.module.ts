import { NgModule } from '@angular/core'
import { CommonModule, NgOptimizedImage } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'

import {
  ButtonDirective,
  DropdownTriggerDirective,
  PermissionDirective,
  SelectorDirective,
  SliderDirective,
  SlotDirective,
  TextfieldDirective,
} from './directives'
import {
  AppBarComponent,
  ErrorComponent,
  LogoComponent,
  MediaCardComponent,
  MediaCardSubtitleDirective,
  MediaCardTitleDirective,
  MenuComponent,
  PlayIconComponent,
  TextfieldComponent,
} from './components'
import { ImageUrlPipe, NumberSequencePipe } from './pipes'

@NgModule({
  imports: [CommonModule, NgOptimizedImage, ReactiveFormsModule, RouterModule],
  declarations: [
    AppBarComponent,
    ButtonDirective,
    DropdownTriggerDirective,
    ErrorComponent,
    ImageUrlPipe,
    LogoComponent,
    MediaCardComponent,
    MediaCardSubtitleDirective,
    MediaCardTitleDirective,
    MenuComponent,
    NumberSequencePipe,
    PermissionDirective,
    PlayIconComponent,
    SelectorDirective,
    SliderDirective,
    SlotDirective,
    TextfieldComponent,
    TextfieldDirective,
  ],
  exports: [
    AppBarComponent,
    ButtonDirective,
    CommonModule,
    DropdownTriggerDirective,
    ErrorComponent,
    ImageUrlPipe,
    LogoComponent,
    MediaCardComponent,
    MediaCardSubtitleDirective,
    MediaCardTitleDirective,
    MenuComponent,
    NgOptimizedImage,
    NumberSequencePipe,
    PermissionDirective,
    PlayIconComponent,
    ReactiveFormsModule,
    RouterModule,
    SelectorDirective,
    SliderDirective,
    SlotDirective,
    TextfieldComponent,
    TextfieldDirective,
  ],
})
export class SharedModule {}
