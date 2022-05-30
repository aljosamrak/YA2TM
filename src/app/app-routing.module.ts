import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AchievementsComponent } from './achievements/achievements.component'
import { DrillDownComponent } from './drill-down/drill-down.component'
import { DuplicatesComponent } from './duplicates/duplicates.component'
import { PageNotFoundComponentComponent } from './page-not-found-component/page-not-found-component.component'
import { SettingsComponent } from './settings/component/settings.component'
import { TabInsightsComponent } from './tab-insights/history/tab-insights-component.component'
import { TabsComponent } from './tabs/tabs.component'
import { TestingComponent } from './testing/testing.component'

const routes: Routes = [
  { path: 'tabs', component: TabsComponent },
  { path: 'graphs', component: TabInsightsComponent },
  { path: 'drillDown', component: DrillDownComponent },
  { path: 'duplicates', component: DuplicatesComponent },
  { path: 'achievements', component: AchievementsComponent },
  { path: 'settings', component: SettingsComponent },

  // For testing purposes in development mode
  { path: 'testing', component: TestingComponent },

  // Default to graphs
  { path: '', redirectTo: '/graphs', pathMatch: 'full' },
  // Wildcard route for a 404 page
  { path: '**', component: PageNotFoundComponentComponent },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
