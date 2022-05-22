import { CommonModule } from '@angular/common'
import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatSelectModule } from '@angular/material/select'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

const MODULES = [
  CommonModule,
  ReactiveFormsModule,
  BrowserModule,
  MatButtonModule,
  MatSlideToggleModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatSelectModule,
  BrowserAnimationsModule,
]

@NgModule({
  imports: MODULES,
  providers: MODULES.map((module) => ({
    provide: module,
  })),
  exports: MODULES,
})
export class SettingsModule {
  public static forRoot(): ModuleWithProviders<SettingsModule> {
    return {
      ngModule: SettingsModule,
    }
  }
  constructor(@Optional() @SkipSelf() parentModule: SettingsModule) {
    if (parentModule) {
      throw new Error(
        'SettingsModule is already loaded. Import it in the AppModule only',
      )
    }
  }
}
