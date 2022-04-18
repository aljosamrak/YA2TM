import { CommonModule } from '@angular/common'
import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core'
import { NgGoogleAnalyticsComponent } from './ng-google-analytics.component'
//Service
import {
  AnalyticsIdConfig,
  NgGoogleAnalyticsTracker,
} from './ng-google-analytics.service'

@NgModule({
  declarations: [NgGoogleAnalyticsComponent],
  imports: [CommonModule],
  exports: [NgGoogleAnalyticsComponent],
})
export class NgGoogleAnalyticsModule {
  constructor(
    @Optional() @SkipSelf() parentModule: NgGoogleAnalyticsModule,
    public ngGoogleAnalytics: NgGoogleAnalyticsTracker,
  ) {
    if (parentModule) {
      throw new Error(
        'NgGoogleAnalyticsModule is already loaded. Import it in the AppModule only',
      )
    }
  }

  static forRoot(
    config: AnalyticsIdConfig,
  ): ModuleWithProviders<NgGoogleAnalyticsModule> {
    return {
      ngModule: NgGoogleAnalyticsModule,
      providers: [{ provide: AnalyticsIdConfig, useValue: config }],
    }
  }
}
