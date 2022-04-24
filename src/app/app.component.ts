import { Component, OnInit } from '@angular/core'
import { Subscription } from 'rxjs'
import { UserPreferences } from './settings/module/user-preferences'
import { SettingsService } from './settings/service/settings.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent implements OnInit {
  subscription?: Subscription

  title = 'YA2TM'

  duplicateEnabled?: boolean
  achievementsEnabled?: boolean
  tabsEnabled?: boolean

  constructor(private settingsService: SettingsService) {}

  ngOnInit() {
    this.subscription = this.settingsService.userPreferences$.subscribe(
      (item: UserPreferences) => {
        this.duplicateEnabled = item.experiments.deduplicateTabs
        this.achievementsEnabled = item.experiments.achievementsEnabled
        this.tabsEnabled = item.experiments.tabsEnabled
      },
    )
  }

  openFullScreen() {
    window.open(chrome.runtime.getURL('index.html'))
  }
}
