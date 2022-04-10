import {NgModule} from '@angular/core'
import {RouterModule, Routes} from '@angular/router'
import {TabInsightsComponent} from './tab-insights/history/tab-insights-component.component'
import {TabsComponent} from './tabs/tabs.component'
import {PageNotFoundComponentComponent} from './page-not-found-component/page-not-found-component.component'
import {AchievementsComponent} from './achievements/achievements.component'
import {DuplicatesComponent} from './duplicates/duplicates.component'
import {SettingsComponent} from './settings/settings.component'

const routes: Routes = [
  {path: 'tabs', component: TabsComponent},
  {path: 'graphs', component: TabInsightsComponent},
  {path: 'duplicates', component: DuplicatesComponent},
  {path: 'achievements', component: AchievementsComponent},
  {path: 'settings', component: SettingsComponent},
  {path: '', redirectTo: '/first-component', pathMatch: 'full'}, // redirect to `first-component`
  {path: '**', component: PageNotFoundComponentComponent}, // Wildcard route for a 404 page
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
