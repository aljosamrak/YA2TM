import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MatIconModule } from '@angular/material/icon'

import { MatInputModule } from '@angular/material/input'
import { MDBBootstrapModule } from 'angular-bootstrap-md'
import { NgChartsModule } from 'ng2-charts'
import { AchievementsComponent } from '../achievements/achievements.component'
import { ChromeApiService } from '../chrome/chrome-api.service'
import { DrillDownComponent } from '../drill-down/drill-down.component'
import { DuplicatesComponent } from '../duplicates/component/duplicates.component'
import { SettingsComponent } from '../settings/component/settings.component'
import { SettingsModule } from '../settings/settings.module'
import { SnoozedTabsComponent } from '../snooze/component/snooze-tabs.component'
import { DatabaseService } from '../storage/service/database.service'
import { LocalStorageService } from '../storage/service/local-storage.service'
import { TabInsightsModule } from '../tab-insights/tab-insights.module'
import { TabComponent } from '../tab/tab.component'
import { TabsComponent } from '../tabs/tabs.component'
import { TestingComponent } from '../testing/testing.component'
import { PopupRoutingModule } from './popup-routing.module'
import { PopupComponent } from './popup.component'

@NgModule({
  declarations: [
    PopupComponent,
    TabsComponent,
    DuplicatesComponent,
    SettingsComponent,
    AchievementsComponent,
    DrillDownComponent,
    TestingComponent,
    TabComponent,
    SnoozedTabsComponent,
  ],
  imports: [
    CommonModule,
    PopupRoutingModule,
    NgChartsModule,
    TabInsightsModule,
    MDBBootstrapModule.forRoot(),
    SettingsModule.forRoot(),
    MatInputModule,
    MatIconModule,
  ],
  providers: [ChromeApiService, DatabaseService, LocalStorageService],
})
export class PopupModule {}
