import { CommonModule } from '@angular/common'
import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core'
import { AnalyticsComponent } from './analytics.component'
import { AnalyticsIdConfig, AnalyticsService } from './analytics.service'

@NgModule({
  declarations: [AnalyticsComponent],
  imports: [CommonModule],
  exports: [AnalyticsComponent],
})
export class AnalyticsModule {
  constructor(
    @Optional() @SkipSelf() parentModule: AnalyticsModule,
    public ngGoogleAnalytics: AnalyticsService,
  ) {
    if (parentModule) {
      throw new Error(
        'AnalyticsModule is already loaded. Import it in the AppModule only',
      )
    }
  }

  static forRoot(
    config: AnalyticsIdConfig,
  ): ModuleWithProviders<AnalyticsModule> {
    return {
      ngModule: AnalyticsModule,
      providers: [{ provide: AnalyticsIdConfig, useValue: config }],
    }
  }
}
