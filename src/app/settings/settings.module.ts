import { CommonModule } from '@angular/common'
import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core'

@NgModule({
  imports: [CommonModule],
})
export class SettingsModule {
  static forRoot(): ModuleWithProviders<SettingsModule> {
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
