import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { MDBBootstrapModule } from 'angular-bootstrap-md'
import { NgChartsModule } from 'ng2-charts'
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger'
import { BadgeController } from '../controller/BadgeController'
import { ExperimentsController } from '../controller/ExperimentsController'
import { TabController } from '../controller/tab/TabController'
import { GOOGLE_ANALYTICS_TRACKING_ID } from '../environments/environment-generated'
import { ChromeTabData } from '../model/chrome/ChromeTabData'
import { ChromeWindowData } from '../model/chrome/ChromeWindowData'
import { IndexedDBDatabase } from '../model/indexeddb/IndexedDBDatabase'
import { LocalStorageImpl } from '../storage/LocalStorageImpl'
import { ChromeBadgeView } from '../view/chrome/ChromeBadgeView'
import { AchievementsComponent } from './achievements/achievements.component'
import { NgGoogleAnalyticsModule } from './analytics/ng-google-analytics.module'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { DuplicatesComponent } from './duplicates/duplicates.component'
import { PageNotFoundComponentComponent } from './page-not-found-component/page-not-found-component.component'
import { SettingsComponent } from './settings/settings.component'
import { TabInsightsModule } from './tab-insights/tab-insights.module'
import { TabsComponent } from './tabs/tabs.component'


@NgModule({
  declarations: [
    AppComponent,
    TabsComponent,
    DuplicatesComponent,
    SettingsComponent,
    AchievementsComponent,
    PageNotFoundComponentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgChartsModule,
    TabInsightsModule,
    MDBBootstrapModule.forRoot(), // HttpClientModule is only needed if you want to log on server or if you want to inspect sourcemaps
    HttpClientModule,
    LoggerModule.forRoot({
      level: NgxLoggerLevel.DEBUG,
      serverLogLevel: NgxLoggerLevel.ERROR,
    }),
    NgGoogleAnalyticsModule.forRoot({
      id: GOOGLE_ANALYTICS_TRACKING_ID,
      scriptPath: 'analytics/analytics.js',
    }),
  ],
  providers: [
    { provide: 'LocalStorage', useClass: LocalStorageImpl },
    { provide: 'Database', useClass: IndexedDBDatabase },
    { provide: 'ExperimentsController', useClass: ExperimentsController },

    // Models
    { provide: 'TabData', useClass: ChromeTabData },
    { provide: 'WindowData', useClass: ChromeWindowData },

    // Views
    { provide: 'BadgeView', useClass: ChromeBadgeView },

    // Controllers
    { provide: 'BadgeController', useClass: BadgeController },
    { provide: 'TabController', useClass: TabController },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
