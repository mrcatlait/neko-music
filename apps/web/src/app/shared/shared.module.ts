import { NgModule } from '@angular/core'
import { CommonModule, NgOptimizedImage } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'

import {
  ButtonDirective,
  DialogCloseDirective,
  DropdownTriggerDirective,
  PermissionDirective,
  PortalOutletDirective,
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
    DialogCloseDirective,
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
    PortalOutletDirective,
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
    DialogCloseDirective,
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
    PortalOutletDirective,
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
