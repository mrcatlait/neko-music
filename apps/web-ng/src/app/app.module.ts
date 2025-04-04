import {
  NgModule,
  provideExperimentalZonelessChangeDetection,
} from "@angular/core";
import { SharedModule } from "@shared/shared.module";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";

import { CoreModule } from "@core/core.module";
import { LayoutModule } from "@features/layout";

@NgModule({
  declarations: [AppComponent],
  imports: [AppRoutingModule, CoreModule, LayoutModule, SharedModule],
  providers: [provideExperimentalZonelessChangeDetection()],
  bootstrap: [AppComponent],
})
export class AppModule {}
