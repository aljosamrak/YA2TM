import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { MatInputModule } from '@angular/material/input'
import { BrowserModule } from '@angular/platform-browser'
import { MDBBootstrapModule } from 'angular-bootstrap-md'
import { NgChartsModule } from 'ng2-charts'
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger'

import { GOOGLE_ANALYTICS_TRACKING_ID } from '../environments/environment-generated'
import { AchievementsComponent } from './achievements/achievements.component'
import { AnalyticsModule } from './analytics/analytics.module'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { ChromeApiService } from './chrome/chrome-api.service'
import { DrillDownComponent } from './drill-down/drill-down.component'
import { DuplicatesComponent } from './duplicates/component/duplicates.component'
import { PageNotFoundComponentComponent } from './page-not-found-component/page-not-found-component.component'
import { SettingsComponent } from './settings/component/settings.component'
import { SettingsModule } from './settings/settings.module'
import { DatabaseService } from './storage/service/database.service'
import { LocalStorageService } from './storage/service/local-storage.service'
import { TabInsightsModule } from './tab-insights/tab-insights.module'
import { TabsComponent } from './tabs/tabs.component'
import { TestingComponent } from './testing/testing.component'

@NgModule({
  declarations: [
    AppComponent,
    TabsComponent,
    DuplicatesComponent,
    SettingsComponent,
    AchievementsComponent,
    PageNotFoundComponentComponent,
    DrillDownComponent,
    TestingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgChartsModule,
    TabInsightsModule,
    MDBBootstrapModule.forRoot(),
    // HttpClientModule is only needed if you want to log on server or if you want to inspect sourcemaps
    HttpClientModule,
    LoggerModule.forRoot({
      level: NgxLoggerLevel.DEBUG,
      serverLogLevel: NgxLoggerLevel.ERROR,
    }),
    AnalyticsModule.forRoot({
      id: GOOGLE_ANALYTICS_TRACKING_ID,
    }),
    SettingsModule.forRoot(),
    MatInputModule,
  ],
  providers: [ChromeApiService, DatabaseService, LocalStorageService],
  bootstrap: [AppComponent],
})
export class AppModule {}
