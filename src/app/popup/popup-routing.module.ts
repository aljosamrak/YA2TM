import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AchievementsComponent } from '../achievements/achievements.component'
import { DrillDownComponent } from '../drill-down/drill-down.component'
import { DuplicatesComponent } from '../duplicates/component/duplicates.component'
import { PageNotFoundComponentComponent } from '../page-not-found-component/page-not-found-component.component'
import { SettingsComponent } from '../settings/component/settings.component'
import { SnoozedTabsComponent } from '../snooze/component/snooze-tabs.component'
import { TabInsightsComponent } from '../tab-insights/history/tab-insights-component.component'
import { TabsComponent } from '../tabs/tabs.component'
import { TestingComponent } from '../testing/testing.component'
import { PopupComponent } from './popup.component'

const routes: Routes = [
  {
    path: '',
    component: PopupComponent,
    children: [
      // Default to graphs
      { path: '', redirectTo: 'graphs', pathMatch: 'full' },

      { path: 'tabs', component: TabsComponent },
      { path: 'graphs', component: TabInsightsComponent },
      { path: 'drillDown', component: DrillDownComponent },
      { path: 'duplicates', component: DuplicatesComponent },
      { path: 'snoozed', component: SnoozedTabsComponent },
      { path: 'achievements', component: AchievementsComponent },
      { path: 'settings', component: SettingsComponent },

      // For testing purposes in development mode
      { path: 'testing', component: TestingComponent },

      // Wildcard route for a 404 page
      { path: '**', component: PageNotFoundComponentComponent },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PopupRoutingModule {}
