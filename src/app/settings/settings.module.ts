import { CommonModule } from '@angular/common'
import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  declarations: [],
  exports: [CommonModule, FormsModule, ReactiveFormsModule],
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
