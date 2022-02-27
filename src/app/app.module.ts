import {NgModule} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'

import {AppRoutingModule} from './app-routing.module'
import {AppComponent} from './app.component'
import {TabsComponent} from './tabs/tabs.component'
import {HistoryComponent} from './history/history.component'
import {DuplicatesComponent} from './duplicates/duplicates.component'
import {SettingsComponent} from './settings/settings.component'
import {NgChartsModule} from 'ng2-charts'
import {AchievementsComponent} from './achievements/achievements.component'
import {GoogleAnalytics} from '../analytics/GoogleAnalytics'
import {Analytics} from '../analytics/Analytics'
import {LocalStorage} from '../storage/LocalStorage'
import {LocalStorageImpl} from '../storage/LocalStorageImpl'
import {Database} from '../model/Database'
import {IndexedDBDatabase} from '../model/indexeddb/IndexedDBDatabase'
import {ExperimentsController} from '../controller/ExperimentsController'
import {TabData} from '../model/TabData'
import {ChromeTabData} from '../model/chrome/ChromeTabData'
import {WindowData} from '../model/WindowData'
import {ChromeWindowData} from '../model/chrome/ChromeWindowData'
import {BadgeView} from '../view/BadgeView'
import {ChromeBadgeView} from '../view/chrome/ChromeBadgeView'
import {BadgeController} from '../controller/BadgeController'
import {TabController} from '../controller/tab/TabController'
import {TotalTabChartComponent} from './chart-components/total-tab-chart.component'
import {PageNotFoundComponentComponent} from './page-not-found-component/page-not-found-component.component'
import {MDBBootstrapModule} from 'angular-bootstrap-md'

@NgModule({
  declarations: [
    AppComponent,
    TabsComponent,
    HistoryComponent,
    DuplicatesComponent,
    SettingsComponent,
    AchievementsComponent,
    TotalTabChartComponent,
    PageNotFoundComponentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgChartsModule,
    MDBBootstrapModule.forRoot(),
  ],
  providers: [
    {provide: 'Analytics', useClass: GoogleAnalytics},

    {provide: 'LocalStorage', useClass: LocalStorageImpl},
    {provide: 'Database', useClass: IndexedDBDatabase},
    {provide: 'ExperimentsController', useClass: ExperimentsController},

    // Models
    {provide: 'TabData', useClass: ChromeTabData},
    {provide: 'WindowData', useClass: ChromeWindowData},

    // Views
    {provide: 'BadgeView', useClass: ChromeBadgeView},

    // Controllers
    {provide: 'BadgeController', useClass: BadgeController},
    {provide: 'TabController', useClass: TabController},
    {provide: 'Analytics', useClass: GoogleAnalytics},
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
